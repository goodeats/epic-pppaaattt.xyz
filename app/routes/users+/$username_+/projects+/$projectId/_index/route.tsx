import { parse } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import {
	type LoaderFunctionArgs,
	json,
	type ActionFunctionArgs,
} from '@remix-run/node'
import {
	type MetaFunction,
	useLoaderData,
	type UIMatch,
} from '@remix-run/react'
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
import { type loader as projectsLoader } from '../../route.tsx'
import { Content, Footer, Header } from './components.tsx'

export const handle = {
	breadcrumb: (match: UIMatch) => {
		const { params } = match
		return params.projectId
	},
}

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const project = await prisma.project.findFirst({
		where: { slug: params.projectId, ownerId: userId },
		select: {
			id: true,
			name: true,
			description: true,
			isVisible: true,
			ownerId: true,
			updatedAt: true,
			artboards: {
				select: {
					name: true,
					description: true,
					isVisible: true,
					slug: true,
					width: true,
					height: true,
					backgroundColor: true,
					updatedAt: true,
				},
			},
		},
	})

	invariantResponse(project, 'Not found', { status: 404 })

	const date = new Date(project.updatedAt)
	const timeAgo = formatDistanceToNow(date)

	return json({
		project,
		timeAgo,
	})
}

const DeleteFormSchema = z.object({
	intent: z.literal('delete-project'),
	projectId: z.string(),
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

	const { projectId } = submission.value

	const project = await prisma.project.findFirst({
		select: { id: true, ownerId: true, owner: { select: { username: true } } },
		where: { id: projectId },
	})
	invariantResponse(project, 'Not found', { status: 404 })

	const isOwner = project.ownerId === userId
	await requireUserWithPermission(
		request,
		isOwner ? `delete:project:own` : `delete:project:any`,
	)

	await prisma.project.delete({ where: { id: project.id } })

	return redirectWithToast(`/users/${project.owner.username}/projects`, {
		type: 'success',
		title: 'Success',
		description: 'Your project has been deleted.',
	})
}

export default function ProjectDetailsRoute() {
	const data = useLoaderData<typeof loader>()
	const user = useOptionalUser()
	const isOwner = user?.id === data.project.ownerId
	const canDelete = userHasPermission(
		user,
		isOwner ? `delete:project:own` : `delete:project:any`,
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
	{ 'routes/users+/$username_+/projects': typeof projectsLoader }
> = ({ data, params, matches }) => {
	const projectsMatch = matches.find(
		m => m.id === 'routes/users+/$username_+/projects',
	)
	const displayName = projectsMatch?.data?.owner.name ?? params.username
	const projectTitle = data?.project.name ?? 'Project'
	const projectDescriptionSummary =
		data && data.project.description.length > 100
			? data?.project.description.slice(0, 97) + '...'
			: 'No description'
	return [
		{ title: `${projectTitle} | ${displayName}'s Projects | XYZ` },
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
				403: () => <p>You are not allowed to do that</p>,
				404: ({ params }) => (
					<p>No project with the id "{params.projectId}" exists</p>
				),
			}}
		/>
	)
}
