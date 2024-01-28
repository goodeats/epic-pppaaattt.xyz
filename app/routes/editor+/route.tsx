import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
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
import { SideNavHeader, Header } from './components'
import { NavTabs } from './nav-tabs'
import { getArtboard, getOwner } from './queries'

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const owner = await getOwner(userId)

	invariantResponse(owner, 'Owner not found', { status: 404 })

	let url = new URL(request.url)
	let artboard
	const artboardId = url.searchParams.get('artboardId')
	if (artboardId) {
		artboard = await getArtboard(userId, artboardId)
	}

	return json({ owner, artboard })
}

export default function EditorRoute() {
	return (
		<MainContainer>
			<ContentWrapper className="md:pl-0">
				<MainContent className="md:rounded-l-3xl md:rounded-r-none">
					<Header />
					<Separator />
					<Outlet />
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
