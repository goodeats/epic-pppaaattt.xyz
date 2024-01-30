import { parse } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import {
	type DataFunctionArgs,
	json,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { type MetaFunction } from '@remix-run/react'
import { formatDistanceToNow } from 'date-fns'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import {
	ContentWrapper,
	MainContainer,
	MainContent,
	SideNavContainer,
	SideNavWrapper,
} from '#app/components/shared'
import { Separator } from '#app/components/ui/separator'
import { requireUserId } from '#app/utils/auth.server'
import { validateCSRF } from '#app/utils/csrf.server'
import { SideNavHeader, Header, Content } from './components'
import { NavTabs } from './nav-tabs'
import { getArtboard, getOwner } from './queries'

const ArtboardSchema = z.object({
	artboardId: z.string(),
})

export async function action({ request }: DataFunctionArgs) {
	console.log('EDITOR ACTION')
	await requireUserId(request)
	const formData = await request.formData()
	await validateCSRF(formData, request.headers)
	const submission = await parse(formData, {
		schema: ArtboardSchema,
	})
	console.log('submission downloading...', submission)

	if (submission.intent !== 'submit') {
		return json({ status: 'idle', submission } as const)
	}
	if (!submission.value) {
		return json({ status: 'error', submission } as const, { status: 400 })
	}

	console.log('downloaded artboard canvas')

	const result = { status: 'success', submission } as const
	console.log('RESULT:', result)
	return result
}

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const owner = await getOwner(userId)

	invariantResponse(owner, 'Owner not found', { status: 404 })

	let url = new URL(request.url)
	let artboard, artboardTimeAgo
	const artboardId = url.searchParams.get('artboardId')
	if (artboardId) {
		artboard = await getArtboard(userId, artboardId)
		if (artboard) {
			const date = new Date(artboard.updatedAt)
			artboardTimeAgo = formatDistanceToNow(date)
		}
	}

	return json({ owner, artboard, artboardTimeAgo })
}

export default function EditorRoute() {
	return (
		<MainContainer>
			<ContentWrapper className="md:pl-0">
				<MainContent className="md:rounded-l-3xl md:rounded-r-none">
					<Header />
					<Separator />
					<Content />
				</MainContent>
				{/* side nav on the right since it is not for navigation */}
				<SideNavWrapper>
					<SideNavContainer>
						<SideNavHeader />
						<Separator />
						<NavTabs />
					</SideNavContainer>
				</SideNavWrapper>
			</ContentWrapper>
		</MainContainer>
	)
}

export const meta: MetaFunction<
	null,
	{ 'routes/editor+/route': typeof loader }
> = ({ params, matches }) => {
	const routeMatch = matches.find(m => m.id === 'routes/editor+/route')
	const displayName = routeMatch?.data?.owner.name ?? params.username
	const descriptionEntity = 'Editor'
	return [
		{ title: `${displayName}'s Editor | XYZ` },
		{
			name: 'description',
			content: `Checkout ${displayName}'s ${descriptionEntity} on PPPAAATTT.XYZ`,
		},
	]
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No user with the username "{params.username}" exists</p>
				),
			}}
		/>
	)
}
