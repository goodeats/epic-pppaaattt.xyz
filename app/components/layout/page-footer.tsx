import Logo from '../logo'
import { ThemeSwitch } from '../theme-switch'

const PageFooter = () => {
	return (
		<div className="container flex justify-between pb-5">
			<Logo />
			<ThemeSwitch />
		</div>
	)
}

export { PageFooter }
