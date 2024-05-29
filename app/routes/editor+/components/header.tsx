import { Link } from '@remix-run/react'
import {
	DashboardHeader,
	DashboardNav,
	DashboardTitle,
} from '#app/components/layout'
import { UserDropdown } from '#app/components/user-dropdown'

export const Header = () => {
	return (
		<DashboardHeader>
			<DashboardTitle>
				<Link prefetch="intent" to="/editor">
					Editor
				</Link>
			</DashboardTitle>
			<DashboardNav>
				<UserDropdown />
			</DashboardNav>
		</DashboardHeader>
	)
}
