import { Link } from '@remix-run/react'
import {
	DashboardHeader,
	DashboardNav,
	DashboardTitle,
} from '#app/components/layout'
import { UserDropdown } from '#app/components/user-dropdown'

export const Header = () => {
	return (
		<DashboardHeader id="sketch-dashboard-header">
			<DashboardTitle id="sketch-dashboard-title">
				<Link prefetch="intent" to="/sketch">
					Sketch
				</Link>
			</DashboardTitle>
			<DashboardNav id="sketch-dashboard-nav">
				<UserDropdown />
			</DashboardNav>
		</DashboardHeader>
	)
}
