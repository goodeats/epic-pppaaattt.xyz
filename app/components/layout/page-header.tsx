import { Link } from '@remix-run/react'
import { useOptionalUser } from '#app/utils/user'
import Logo from '../logo'
import { ThemeSwitch } from '../theme-switch'
import { Button } from '../ui/button'
import { UserDropdown } from '../user-dropdown'

const PageHeader = () => {
	const user = useOptionalUser()

	return (
		<header className="container py-6">
			<nav className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap md:gap-8">
				<Logo />
				<div className="flex items-center gap-10">
					{user ? <UserDropdown /> : <ThemeSwitch />}
				</div>
			</nav>
		</header>
	)
}

const PageHeaderDev = () => {
	const user = useOptionalUser()

	const LoginButton = () => {
		return (
			<Button asChild variant="default" size="lg">
				<Link to="/login">Log In</Link>
			</Button>
		)
	}

	return (
		<header className="container py-6">
			<nav className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap md:gap-8">
				<Logo />
				<div className="flex items-center gap-10">
					{user ? <UserDropdown /> : <LoginButton />}
				</div>
			</nav>
		</header>
	)
}

export { PageHeader, PageHeaderDev }
