import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { type MetaFunction, useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type BreadcrumbHandle } from '#app/utils/breadcrumbs.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { type loader as appearancesLoader } from '../../route.tsx'
import { EditForm, action } from './edit-form.tsx'

export { action }

export const handle: BreadcrumbHandle = {
	breadcrumb: () => 'Edit',
}

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const appearance = await prisma.appearance.findFirst({
		select: {
			id: true,
			name: true,
			description: true,
			value: true,
		},
		where: {
			slug: params.appearanceId,
			ownerId: userId,
		},
	})
	invariantResponse(appearance, 'Not found', { status: 404 })
	return json({ appearance: appearance })
}

export default function AppearanceEdit() {
	const data = useLoaderData<typeof loader>()

	return <EditForm appearance={data.appearance} />
}

export const meta: MetaFunction<
	typeof loader,
	{ 'routes/users+/$username_+/appearances': typeof appearancesLoader }
> = ({ data, params, matches }) => {
	const appearancesMatch = matches.find(
		m => m.id === 'routes/users+/$username_+/appearances',
	)
	const displayName = appearancesMatch?.data?.owner.name ?? params.username
	const entityTitle = data?.appearance.name ?? 'Appearance'
	const entityDescriptionSummary =
		data && data.appearance.description.length > 100
			? data?.appearance.description.slice(0, 97) + '...'
			: 'No description'
	return [
		{ title: `Edit ${entityTitle} | ${displayName}'s Appearances | XYZ` },
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
					<p>No appearance with the id "{params.appearanceId}" exists</p>
				),
			}}
		/>
	)
}
