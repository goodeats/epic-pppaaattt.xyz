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
import { appearanceNavigation } from '#app/utils/appearances'
import { type BreadcrumbHandle } from '#app/utils/breadcrumbs'
import { prisma } from '#app/utils/db.server.ts'
import { Breadcrumbs, Header, List } from './components'

export const handle: BreadcrumbHandle = {
	breadcrumb: () => 'Appearances',
}

export async function loader({ params }: LoaderFunctionArgs) {
	const owner = await prisma.user.findFirst({
		select: {
			id: true,
			name: true,
			username: true,
			image: { select: { id: true } },
			appearances: { select: { slug: true, name: true, type: true } },
		},
		where: { username: params.username },
	})

	const appearances = appearanceNavigation

	invariantResponse(owner, 'Owner not found', { status: 404 })

	return json({ owner, appearances })
}

export default function AppearancesRoute() {
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
					<Breadcrumbs />
					<Separator className="my-4" />
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
