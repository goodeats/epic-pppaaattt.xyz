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
import { type BreadcrumbHandle } from '#app/utils/breadcrumbs'
import { prisma } from '#app/utils/db.server.ts'
import { Breadcrumbs, Header, List } from './components'

export const handle: BreadcrumbHandle = {
	breadcrumb: () => 'Artboards',
}

export async function loader({ params }: LoaderFunctionArgs) {
	const owner = await prisma.user.findFirst({
		select: {
			id: true,
			name: true,
			username: true,
			image: { select: { id: true } },
			projects: {
				select: {
					slug: true,
					name: true,
					artboards: {
						select: {
							slug: true,
							name: true,
						},
					},
				},
			},
			artboards: {
				select: {
					slug: true,
					name: true,
					project: {
						select: {
							slug: true,
							name: true,
						},
					},
				},
			},
		},
		where: { username: params.username },
	})

	invariantResponse(owner, 'Owner not found', { status: 404 })

	return json({ owner })
}

export default function ArtboardsRoute() {
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
					<p>No artboard with the name "{params.artboardId}" exists</p>
				),
			}}
		/>
	)
}
