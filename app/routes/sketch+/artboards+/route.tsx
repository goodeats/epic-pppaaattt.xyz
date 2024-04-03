import { json, type LoaderFunctionArgs } from '@remix-run/node'
import {
	useLoaderData,
	type MetaFunction,
	Outlet,
	useParams,
	Link,
} from '@remix-run/react'
import {
	Dashboard,
	DashboardHeader,
	DashboardNav,
	DashboardTitle,
} from '#app/components/layout'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import { UserDropdown } from '#app/components/user-dropdown'
import { requireUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'
import { useUser } from '#app/utils/user'
import { ArtboardSelector } from './components/artboard-selector'

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const artboards = await prisma.artboard.findMany({
		select: { id: true, slug: true, name: true },
		where: { ownerId: userId },
	})

	return json({ artboards })
}

export default function SketchArtboardsRoute() {
	const data = useLoaderData<typeof loader>()
	const user = useUser()
	const params = useParams()
	const slug = params.slug

	const ArtboardDetailsLink = () => {
		if (!slug) return null

		return (
			<Button asChild size="sm" variant="outline">
				<Link to={`/users/${user.username}/artboards/${slug}`}>
					<Icon name="eye-open" className="scale-125 max-md:scale-150">
						<span className="max-md:hidden">View Details</span>
					</Icon>
				</Link>
			</Button>
		)
	}

	const Header = () => {
		return (
			<DashboardHeader id="sketch-dashboard-header">
				<DashboardTitle id="sketch-dashboard-title">Sketch</DashboardTitle>
				<DashboardNav id="sketch-dashboard-nav">
					<ArtboardDetailsLink />
					<ArtboardSelector artboards={data.artboards} />
					<UserDropdown />
				</DashboardNav>
			</DashboardHeader>
		)
	}

	return (
		<Dashboard id="sketch-dashboard">
			<Header />
			<Outlet />
		</Dashboard>
	)
}

export const meta: MetaFunction<
	null,
	{ 'routes/sketch+/artboards+/route': typeof loader }
> = () => {
	const descriptionEntity = 'Sketch'
	return [
		{ title: `Sketch | XYZ` },
		{
			name: 'description',
			content: `${descriptionEntity} on PPPAAATTT.XYZ`,
		},
	]
}
