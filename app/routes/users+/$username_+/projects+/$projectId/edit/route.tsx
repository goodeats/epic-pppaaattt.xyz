import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { ProjectEditor, action } from './edit-project-form.tsx'

export { action }

export async function loader({ params, request }: LoaderFunctionArgs) {
	console.log('params', params)
	const userId = await requireUserId(request)
	const project = await prisma.project.findFirst({
		select: {
			id: true,
			name: true,
			description: true,
			isVisible: true,
		},
		where: {
			id: params.projectId,
			ownerId: userId,
		},
	})
	invariantResponse(project, 'Not found', { status: 404 })
	return json({ project: project })
}

export default function ProjectEdit() {
	const data = useLoaderData<typeof loader>()
	console.log('data', data)

	return <ProjectEditor project={data.project} />
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
