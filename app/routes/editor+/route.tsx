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
import { prisma } from '#app/utils/db.server.ts'
import { SideNavHeader, List, Header } from './components'

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const owner = await prisma.user.findFirst({
		select: {
			id: true,
			name: true,
			username: true,
			image: { select: { id: true } },
			artboards: { select: { id: true, slug: true, name: true } },
		},
		where: { id: userId },
	})

	invariantResponse(owner, 'Owner not found', { status: 404 })

	return json({ owner })
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
						<List />
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
