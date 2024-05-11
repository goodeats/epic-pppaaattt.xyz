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
import { requireUserWithPermission } from '#app/utils/permissions.server.ts'
import { redirectWithToast } from '#app/utils/toast.server'
import { useOptionalUser, userHasPermission } from '#app/utils/user'
import { type loader as layersLoader } from '../../route.tsx'
import { Content, Footer, Header } from './components.tsx'
import { getLayer } from './queries.ts'

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const layer = await getLayer(userId, params.layerId as string)

	invariantResponse(layer, 'Not found', { status: 404 })

	const date = new Date(layer.updatedAt)
	const timeAgo = formatDistanceToNow(date)

	return json({
		layer,
		timeAgo,
		breadcrumb: layer.name,
	})
}

const DeleteFormSchema = z.object({
	intent: z.literal('delete-layer'),
	layerId: z.string(),
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

	const { layerId } = submission.value

	const layer = await prisma.layer.findFirst({
		select: {
			id: true,
			name: true,
			ownerId: true,
			owner: { select: { username: true } },
		},
		where: { id: layerId },
	})
	invariantResponse(layer, 'Not found', { status: 404 })

	const isOwner = layer.ownerId === userId
	await requireUserWithPermission(
		request,
		isOwner ? `delete:layer:own` : `delete:layer:any`,
	)

	await prisma.layer.delete({ where: { id: layer.id } })

	return redirectWithToast(`/users/${layer.owner.username}/layers`, {
		type: 'success',
		title: 'Success',
		// description: 'Your layer has been deleted.',
		description: `Deleted layer: ${layer.name}`,
	})
}

export default function LayerDetailsRoute() {
	const data = useLoaderData<typeof loader>()
	const user = useOptionalUser()
	const isOwner = user?.id === data.layer.ownerId
	const canDelete = userHasPermission(
		user,
		isOwner ? `delete:layer:own` : `delete:layer:any`,
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
	{ 'routes/users+/$username_+/layers': typeof layersLoader }
> = ({ data, params, matches }) => {
	const entitiesMatch = matches.find(
		m => m.id === 'routes/users+/$username_+/layers',
	)
	const displayName = entitiesMatch?.data?.owner.name ?? params.username
	const entityTitle = data?.layer.name ?? 'Layer'
	const entityDescriptionSummary =
		data?.layer.description && data.layer.description.length > 100
			? data.layer.description.slice(0, 97) + '...'
			: data?.layer.description || 'No description'
	return [
		{ title: `${entityTitle} | ${displayName}'s Layer | XYZ` },
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
					<p>No layer with the name "{params.layerId}" exists</p>
				),
			}}
		/>
	)
}
