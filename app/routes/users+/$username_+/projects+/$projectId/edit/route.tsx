import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { type MetaFunction, useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type BreadcrumbHandle } from '#app/utils/breadcrumbs.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { type loader as projectsLoader } from '../../route.tsx'
import { action } from './edit-project-form.server.ts'
import { EditProjectForm } from './edit-project-form.tsx'

export { action }

export const handle: BreadcrumbHandle = {
	breadcrumb: () => 'Edit',
}

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const project = await prisma.project.findFirst({
		select: {
			id: true,
			name: true,
			description: true,
			isVisible: true,
		},
		where: {
			slug: params.projectId,
			ownerId: userId,
		},
	})
	invariantResponse(project, 'Not found', { status: 404 })
	return json({ project: project })
}

export default function ProjectEdit() {
	const data = useLoaderData<typeof loader>()

	return <EditProjectForm project={data.project} />
}

export const meta: MetaFunction<
	typeof loader,
	{ 'routes/users+/$username_+/projects': typeof projectsLoader }
> = ({ data, params, matches }) => {
	const projectsMatch = matches.find(
		m => m.id === 'routes/users+/$username_+/projects',
	)
	const displayName = projectsMatch?.data?.owner.name ?? params.username
	const entityTitle = data?.project.name ?? 'Project'
	const entityDescriptionSummary =
		data?.project.description && data.project.description.length > 100
			? data.project.description.slice(0, 97) + '...'
			: data?.project.description || 'No description'
	return [
		{ title: `Edit ${entityTitle} | ${displayName}'s Projects | XYZ` },
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
				404: ({ params }) => (
					<p>No project with the id "{params.projectId}" exists</p>
				),
			}}
		/>
	)
}
