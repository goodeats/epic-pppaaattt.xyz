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
import { type loader as appearancesLoader } from '../../route.tsx'
import { Content, Footer, Header } from './components.tsx'

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const appearance = await prisma.appearance.findFirst({
		where: { slug: params.appearanceId, ownerId: userId },
		select: {
			id: true,
			name: true,
			description: true,
			value: true,
			ownerId: true,
			updatedAt: true,
		},
	})

	invariantResponse(appearance, 'Not found', { status: 404 })

	const date = new Date(appearance.updatedAt)
	const timeAgo = formatDistanceToNow(date)

	return json({
		appearance,
		timeAgo,
		breadcrumb: appearance.name,
	})
}

const DeleteFormSchema = z.object({
	intent: z.literal('delete-appearance'),
	appearanceId: z.string(),
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

	const { appearanceId } = submission.value

	const appearance = await prisma.appearance.findFirst({
		select: {
			id: true,
			name: true,
			type: true,
			ownerId: true,
			owner: { select: { username: true } },
		},
		where: { id: appearanceId },
	})
	invariantResponse(appearance, 'Not found', { status: 404 })

	const isOwner = appearance.ownerId === userId
	await requireUserWithPermission(
		request,
		isOwner ? `delete:appearance:own` : `delete:appearance:any`,
	)

	await prisma.appearance.delete({ where: { id: appearance.id } })

	return redirectWithToast(
		`/users/${appearance.owner.username}/appearances/${appearance.type}`,
		{
			type: 'success',
			title: 'Success',
			// description: 'Your appearance has been deleted.',
			description: `Deleted appearance: ${appearance.name}`,
		},
	)
}

export default function AppearanceDetailsRoute() {
	const data = useLoaderData<typeof loader>()
	const user = useOptionalUser()
	const isOwner = user?.id === data.appearance.ownerId
	const canDelete = userHasPermission(
		user,
		isOwner ? `delete:appearance:own` : `delete:appearance:any`,
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
	{ 'routes/users+/$username_+/appearances': typeof appearancesLoader }
> = ({ data, params, matches }) => {
	const entitiesMatch = matches.find(
		m => m.id === 'routes/users+/$username_+/appearances',
	)
	const displayName = entitiesMatch?.data?.owner.name ?? params.username
	const entityTitle = data?.appearance.name ?? 'Appearance'
	const entityDescriptionSummary =
		data && data.appearance.description.length > 100
			? data?.appearance.description.slice(0, 97) + '...'
			: 'No description'
	return [
		{ title: `${entityTitle} | ${displayName}'s Appearance | XYZ` },
		{
			name: 'description',
			content: entityDescriptionSummary,
		},
	]
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				403: () => <p>You are not allowed to do that</p>,
				404: ({ params }) => (
					<p>No appearance with the name "{params.appearanceId}" exists</p>
				),
			}}
		/>
	)
}
