import { colorInvertHexcode } from '#app/utils/colors'
import { Button } from '../ui/button'
import { Icon, type IconName } from '../ui/icon'

const SidebarPanelButton = ({
	iconName,
	iconText,
	type = 'button',
	disabled = false,
	backgroundColor,
}: {
	iconName: IconName
	iconText: string
	type?: 'button' | 'submit' | 'reset'
	disabled?: boolean
	backgroundColor?: string
}) => {
	const className = 'm-2 mr-0 flex cursor-pointer items-center justify-center'

	// if backgroundColor is defined, set the background color and the text color inverted
	const style = backgroundColor
		? {
				backgroundColor: `#${backgroundColor}`,
				color: `#${colorInvertHexcode(backgroundColor)}`,
		  }
		: {}

	return (
		<Button
			type={type}
			variant="ghost"
			size="panel"
			className={className}
			disabled={disabled}
			style={style}
		>
			<Icon name={iconName}>
				<span className="sr-only">{iconText}</span>
			</Icon>
		</Button>
	)
}

const SidebarPanelButtonIcon = ({
	iconName,
	iconText,
}: {
	iconName: IconName
	iconText: string
}) => {
	return (
		<Icon name={iconName}>
			<span className="sr-only">{iconText}</span>
		</Icon>
	)
}

export { SidebarPanelButton, SidebarPanelButtonIcon }
