import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { type MetaFunction, useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type BreadcrumbHandle } from '#app/utils/breadcrumbs.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { type loader as projectsLoader } from '../../route.tsx'
import { EditForm, action } from './edit-form.tsx'

export { action }

export const handle: BreadcrumbHandle = {
	breadcrumb: () => 'Edit',
}

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const layer = await prisma.layer.findFirst({
		select: {
			id: true,
			name: true,
			description: true,
		},
		where: {
			slug: params.projectId,
			ownerId: userId,
		},
	})
	invariantResponse(layer, 'Not found', { status: 404 })
	return json({ layer: layer })
}

export default function ProjectEdit() {
	const data = useLoaderData<typeof loader>()

	return <EditForm layer={data.layer} />
}

export const meta: MetaFunction<
	typeof loader,
	{ 'routes/users+/$username_+/projects': typeof projectsLoader }
> = ({ data, params, matches }) => {
	const projectsMatch = matches.find(
		m => m.id === 'routes/users+/$username_+/projects',
	)
	const displayName = projectsMatch?.data?.owner.name ?? params.username
	const projectTitle = data?.layer.name ?? 'Project'
	const projectDescriptionSummary =
		data && data.layer.description.length > 100
			? data?.layer.description.slice(0, 97) + '...'
			: 'No description'
	return [
		{ title: `Edit ${projectTitle} | ${displayName}'s Projects | XYZ` },
		{
			name: 'description',
			content: projectDescriptionSummary,
		},
	]
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No layer with the id "{params.projectId}" exists</p>
				),
			}}
		/>
	)
}
