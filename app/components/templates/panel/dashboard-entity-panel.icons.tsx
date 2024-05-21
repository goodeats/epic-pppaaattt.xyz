import { Icon, type IconName } from '#app/components/ui/icon'

export const PanelEntityIcon = ({
	icon,
	symbol,
	text,
}: {
	icon?: IconName
	symbol?: string
	text: string
}) => {
	return (
		<div className="m-2 mr-0 flex h-8 w-8 items-center justify-center">
			{icon ? (
				<Icon name={icon}>
					<span className="sr-only">{text}</span>
				</Icon>
			) : symbol ? (
				<span className="text-body-xs leading-none">{symbol}</span>
			) : null}
		</div>
	)
}
