import { invariantResponse } from '@epic-web/invariant'
import {
	type DataFunctionArgs,
	json,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useLoaderData, type MetaFunction } from '@remix-run/react'
import { formatDistanceToNow } from 'date-fns'
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
import {
	INTENT,
	downloadArtboardCanvasAction,
	updateArtboardBackgroundColorAction,
	updateArtboardDimensionsAction,
} from './actions'
import { CanvasContent } from './canvas'
import {
	SideNavHeader,
	Header,
	NoArtboardContent,
	NavTabsNoArtboard,
} from './components'
import { NavTabs } from './nav-tabs'
import { getArtboard, getOwner } from './queries'

export async function action({ request }: DataFunctionArgs) {
	console.log('EDITOR ACTION')
	const userId = await requireUserId(request)
	const formData = await request.formData()
	await validateCSRF(formData, request.headers)
	const intent = formData.get('intent')

	switch (intent) {
		case INTENT.downloadArtboardCanvas: {
			return downloadArtboardCanvasAction({ request, userId, formData })
		}
		case INTENT.updateArtboardDimensions: {
			return updateArtboardDimensionsAction({ request, userId, formData })
		}
		case INTENT.updateArtboardBackgroundColor: {
			return updateArtboardBackgroundColorAction({ request, userId, formData })
		}
		default: {
			throw new Response(`Invalid intent "${intent}"`, { status: 400 })
		}
	}
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
	const data = useLoaderData<typeof loader>()
	const { artboard } = data

	return (
		<MainContainer>
			<ContentWrapper className="md:pl-0">
				<MainContent className="md:rounded-l-3xl md:rounded-r-none">
					<Header />
					<Separator />
					{artboard ? <CanvasContent /> : <NoArtboardContent />}
				</MainContent>
				{/* side nav on the right since it is not for navigation */}
				<SideNavWrapper>
					<SideNavContainer>
						<SideNavHeader />
						<Separator />
						{artboard ? <NavTabs /> : <NavTabsNoArtboard />}
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
