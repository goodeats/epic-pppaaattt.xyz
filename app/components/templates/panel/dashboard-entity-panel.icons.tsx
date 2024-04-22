import { Icon } from '#app/components/ui/icon'
import { type IDashboardPanelIcon } from '#app/strategies/component/dashboard-panel/update-entity/update-entity-values'

export const PanelEntityIcon = ({
	panelEntityIcon,
}: {
	panelEntityIcon: IDashboardPanelIcon
}) => {
	const { icon, symbol, text } = panelEntityIcon
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
