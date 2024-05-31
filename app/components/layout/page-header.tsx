import { Link, useMatches } from '@remix-run/react'
import { useRootLoaderData } from '#app/root'
import { cn } from '#app/utils/misc'
import { useOptionalUser } from '#app/utils/user'
import Logo from '../logo'
import { ThemeSwitch } from '../theme-switch'
import { Button } from '../ui/button'
import { UserDropdown } from '../user-dropdown'
import { createContainerComponent } from './utils'

const PageHeaderComponent = createContainerComponent({
	defaultTagName: 'header',
	// defaultClassName: 'container py-4',
	defaultClassName: cn(
		'md:h-16',
		'p-8 py-4',
		'flex items-start justify-between sm:flex-row sm:items-center',
	),
	displayName: 'PageHeaderComponent',
})

const PageHeaderNav = createContainerComponent({
	defaultTagName: 'nav',
	defaultClassName:
		'flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap md:gap-8 w-full',
	displayName: 'PageHeaderNav',
})

const PageHeaderNavSection = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'flex items-center gap-10',
	displayName: 'PageHeaderNavSection',
})

const LoginButton = () => {
	return (
		<Button asChild variant="default" size="lg">
			<Link to="/login">Log In</Link>
		</Button>
	)
}

export const PageHeader = () => {
	const user = useOptionalUser()
	const data = useRootLoaderData()
	const env = data.ENV
	const isProduction = env.MODE === 'production'

	const matches = useMatches()
	const isEditorDashboard = matches.some(m => m.id.includes('editor+'))

	return (
		<PageHeaderComponent>
			<PageHeaderNav>
				<PageHeaderNavSection>
					<Logo />
				</PageHeaderNavSection>
				<PageHeaderNavSection>
					{user ? (
						<>
							{isEditorDashboard && <ThemeSwitch />}
							<UserDropdown />
						</>
					) : isProduction ? (
						<ThemeSwitch />
					) : (
						<LoginButton />
					)}
				</PageHeaderNavSection>
			</PageHeaderNav>
		</PageHeaderComponent>
	)
}
