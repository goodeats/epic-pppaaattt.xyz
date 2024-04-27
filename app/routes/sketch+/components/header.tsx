import { Link, useMatches } from '@remix-run/react'
import {
	DashboardHeader,
	DashboardNav,
	DashboardTitle,
} from '#app/components/layout'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import { UserDropdown } from '#app/components/user-dropdown'
import { useOptionalRouteLoaderMatchData } from '#app/utils/matches'
import { useUser } from '#app/utils/user'
import { artboardLoaderRoute } from '../projects+/$projectSlug_+/artboards+/$artboardSlug+/route'

export const Header = () => {
	return (
		<DashboardHeader id="sketch-dashboard-header">
			<DashboardTitle id="sketch-dashboard-title">
				<Link prefetch="intent" to="/sketch">
					Sketchy
				</Link>
			</DashboardTitle>
			<DashboardNav id="sketch-dashboard-nav">
				<ArtboardDetailsLink />
				{/* <ArtboardSelector artboards={data.artboards} /> */}
				<UserDropdown />
			</DashboardNav>
		</DashboardHeader>
	)
}

const ArtboardDetailsLink = () => {
	const user = useUser()
	const matches = useMatches()
	const data = useOptionalRouteLoaderMatchData(matches, artboardLoaderRoute)
	const artboard = data?.artboard
	if (!artboard) return null

	return (
		<Button asChild size="sm" variant="outline">
			<Link to={`/users/${user.username}/artboards/${artboard.slug}`}>
				<Icon name="eye-open" className="scale-125 max-md:scale-150">
					<span className="max-md:hidden">View Details</span>
				</Icon>
			</Link>
		</Button>
	)
}
