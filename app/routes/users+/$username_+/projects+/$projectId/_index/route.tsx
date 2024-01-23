import { useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import {
	type LoaderFunctionArgs,
	json,
	type ActionFunctionArgs,
} from '@remix-run/node'
import {
	Form,
	Link,
	type MetaFunction,
	useActionData,
	useLoaderData,
} from '@remix-run/react'
import { formatDistanceToNow } from 'date-fns'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { floatingToolbarClassName } from '#app/components/floating-toolbar'
import { ErrorList } from '#app/components/forms'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import { StatusButton } from '#app/components/ui/status-button'
import { requireUserId } from '#app/utils/auth.server'
import { validateCSRF } from '#app/utils/csrf.server'
import { prisma } from '#app/utils/db.server'
import { useIsPending } from '#app/utils/misc'
import {
	requireUserWithPermission,
	userHasPermission,
} from '#app/utils/permissions'
import { redirectWithToast } from '#app/utils/toast.server'
import { useOptionalUser } from '#app/utils/user'
import { type loader as projectsLoader } from '../../route.tsx'

export async function loader({ params }: LoaderFunctionArgs) {
	const project = await prisma.project.findUnique({
		where: { id: params.projectId },
		select: {
			id: true,
			name: true,
			description: true,
			isVisible: true,
			ownerId: true,
			updatedAt: true,
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
		<div className="absolute inset-0 flex flex-col px-10">
			<h2 className="mb-2 pt-12 text-h2 lg:mb-6">{data.project.name}</h2>
			<div className={`${displayBar ? 'pb-24' : 'pb-12'} overflow-y-auto`}>
				{/* <ul className="flex flex-wrap gap-5 py-5">
					{data.project.images.map(image => (
						<li key={image.id}>
							<a href={getNoteImgSrc(image.id)}>
								<img
									src={getNoteImgSrc(image.id)}
									alt={image.altText ?? ''}
									className="h-32 w-32 rounded-lg object-cover"
								/>
							</a>
						</li>
					))}
				</ul> */}
				<p className="whitespace-break-spaces text-sm md:text-lg">
					Visible: {data.project.isVisible ? 'Yes' : 'No'}
				</p>
				<p className="whitespace-break-spaces text-sm md:text-lg">
					{data.project.description}
				</p>
			</div>
			{displayBar ? (
				<div className={floatingToolbarClassName}>
					<span className="text-sm text-foreground/90 max-[524px]:hidden">
						<Icon name="clock" className="scale-125">
							{data.timeAgo} ago
						</Icon>
					</span>
					<div className="grid flex-1 grid-cols-2 justify-end gap-2 min-[525px]:flex md:gap-4">
						{canDelete ? <DeletePermission id={data.project.id} /> : null}
						<Button
							asChild
							className="min-[525px]:max-md:aspect-square min-[525px]:max-md:px-0"
						>
							<Link to="edit">
								<Icon name="pencil-1" className="scale-125 max-md:scale-150">
									<span className="max-md:hidden">Edit</span>
								</Icon>
							</Link>
						</Button>
					</div>
				</div>
			) : null}
		</div>
	)
}

export function DeletePermission({ id }: { id: string }) {
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()
	const [form] = useForm({
		id: 'delete-project',
		lastSubmission: actionData?.submission,
	})

	return (
		<Form method="POST" {...form.props}>
			<AuthenticityTokenInput />
			<input type="hidden" name="projectId" value={id} />
			<StatusButton
				type="submit"
				name="intent"
				value="delete-project"
				variant="destructive"
				status={isPending ? 'pending' : actionData?.status ?? 'idle'}
				disabled={isPending}
				className="w-full max-md:aspect-square max-md:px-0"
			>
				<Icon name="trash" className="scale-125 max-md:scale-150">
					<span className="max-md:hidden">Delete</span>
				</Icon>
			</StatusButton>
			<ErrorList errors={form.errors} id={form.errorId} />
		</Form>
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
