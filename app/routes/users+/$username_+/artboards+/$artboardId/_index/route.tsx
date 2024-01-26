import { parse } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import {
	type LoaderFunctionArgs,
	json,
	type ActionFunctionArgs,
} from '@remix-run/node'
import { type MetaFunction, useLoaderData } from '@remix-run/react'
import { formatDistanceToNow } from 'date-fns'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { ContainerDetails } from '#app/components/shared/container.tsx'
import { requireUserId } from '#app/utils/auth.server'
import { validateCSRF } from '#app/utils/csrf.server'
import { prisma } from '#app/utils/db.server'
import {
	requireUserWithPermission,
	userHasPermission,
} from '#app/utils/permissions'
import { redirectWithToast } from '#app/utils/toast.server'
import { useOptionalUser } from '#app/utils/user'
import { type loader as artboardsLoader } from '../../route.tsx'
import { Content, Footer, Header } from './components.tsx'
import { getArtboard } from './queries.ts'

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const artboard = await getArtboard(userId, params.artboardId as string)

	invariantResponse(artboard, 'Not found', { status: 404 })

	const date = new Date(artboard.updatedAt)
	const timeAgo = formatDistanceToNow(date)

	return json({
		artboard,
		timeAgo,
		breadcrumb: artboard.name,
		project: artboard.project,
	})
}

const DeleteFormSchema = z.object({
	intent: z.literal('delete-artboard'),
	artboardId: z.string(),
})

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	await validateCSRF(formData, request.headers)
	const submission = parse(formData, {
		schema: DeleteFormSchema,
	})
	if (submission.intent !== 'submit') {
		return json({ status: 'idle', submission } as const)
	}
	if (!submission.value) {
		return json({ status: 'error', submission } as const, { status: 400 })
	}

	const { artboardId } = submission.value

	const artboard = await prisma.artboard.findFirst({
		select: {
			id: true,
			name: true,
			ownerId: true,
			owner: {
				select: { username: true },
			},
			project: {
				select: {
					slug: true,
				},
			},
		},
		where: { id: artboardId },
	})
	invariantResponse(artboard, 'Not found', { status: 404 })

	const { id, name, owner, ownerId, project } = artboard

	const isOwner = ownerId === userId
	await requireUserWithPermission(
		request,
		isOwner ? `delete:artboard:own` : `delete:artboard:any`,
	)

	await prisma.artboard.delete({ where: { id: id } })

	return redirectWithToast(
		`/users/${owner.username}/projects/${project.slug}`,
		{
			type: 'success',
			title: 'Success',
			// description: 'Your artboard has been deleted.',
			description: `Deleted artboard: "${name}"`,
		},
	)
}

export default function ArtboardDetailsRoute() {
	const data = useLoaderData<typeof loader>()
	const user = useOptionalUser()
	const isOwner = user?.id === data.artboard.ownerId
	const canDelete = userHasPermission(
		user,
		isOwner ? `delete:artboard:own` : `delete:artboard:any`,
	)
	const displayBar = canDelete || isOwner

	return (
		<ContainerDetails>
			<Header />
			<Content />
			{displayBar ? <Footer /> : null}
		</ContainerDetails>
	)
}

export const meta: MetaFunction<
	typeof loader,
	{ 'routes/users+/$username_+/artboards': typeof artboardsLoader }
> = ({ data, params, matches }) => {
	const artboardssMatch = matches.find(
		m => m.id === 'routes/users+/$username_+/artboards',
	)
	const displayName = artboardssMatch?.data?.owner.name ?? params.username
	const artboardTitle = data?.artboard.name ?? 'Artboard'
	const artboardDescriptionSummary =
		data && data.artboard.description.length > 100
			? data?.artboard.description.slice(0, 97) + '...'
			: 'No description'
	return [
		{ title: `${artboardTitle} | ${displayName}'s Artboards | XYZ` },
		{
			name: 'description',
			content: artboardDescriptionSummary,
		},
	]
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				403: () => <p>You are not allowed to do that</p>,
				404: ({ params }) => (
					<p>No artboard with the name "{params.artboardId}" exists</p>
				),
			}}
		/>
	)
}
