import { useOptionalUser } from '#app/utils/user'
import Logo from '../logo'
import { ThemeSwitch } from '../theme-switch'

const PageFooter = () => {
	const user = useOptionalUser()

	return (
		<div className="container flex justify-between pb-5">
			<Logo />
			{user ? <ThemeSwitch /> : '🔺'}
		</div>
	)
}

export { PageFooter }
