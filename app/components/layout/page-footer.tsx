import { useMatches } from '@remix-run/react'
import { useOptionalUser } from '#app/utils/user'
import { GithubProjectLink } from '../github-project-link'
import Logo from '../logo'
import { ThemeSwitch } from '../theme-switch'

const PageFooter = () => {
	const user = useOptionalUser()
	const matches = useMatches()
	const isEditorDashboard = matches.some(m => m.id.includes('editor+'))

	if (isEditorDashboard) return null

	return (
		<div className="container flex justify-between pb-5">
			<Logo />
			{user ? <ThemeSwitch /> : <GithubProjectLink />}
		</div>
	)
}

export { PageFooter }
