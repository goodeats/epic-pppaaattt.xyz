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
import { prisma } from '#app/utils/db.server.ts'
import { Header, List } from './components'

export async function loader({ params }: LoaderFunctionArgs) {
	const owner = await prisma.user.findFirst({
		select: {
			id: true,
			name: true,
			username: true,
			image: { select: { id: true } },
			projects: { select: { id: true, name: true } },
		},
		where: { username: params.username },
	})

	invariantResponse(owner, 'Owner not found', { status: 404 })

	return json({ owner })
}

export default function ProjectsRoute() {
	return (
		<MainContainer>
			<ContentWrapper>
				<SideNavWrapper>
					<SideNavContainer>
						<Header />
						<List />
					</SideNavContainer>
				</SideNavWrapper>
				<MainContent>
					<Outlet />
				</MainContent>
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
