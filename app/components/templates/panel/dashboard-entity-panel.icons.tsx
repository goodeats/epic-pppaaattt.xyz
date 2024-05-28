import { PanelRowIconContainer } from '#app/components/layout'
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
		<PanelRowIconContainer>
			{icon ? (
				<Icon name={icon}>
					<span className="sr-only">{text}</span>
				</Icon>
			) : symbol ? (
				<span className="text-body-xs leading-none">{symbol}</span>
			) : null}
		</PanelRowIconContainer>
	)
}
