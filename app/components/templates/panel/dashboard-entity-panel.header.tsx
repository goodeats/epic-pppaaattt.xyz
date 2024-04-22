import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import {
	type designParentTypeIdEnum,
	type designTypeEnum,
} from '#app/schema/design'
import { type IDashboardPanelCreateEntityStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import { capitalize } from '#app/utils/string-formatting'
import { SidebarPanelHeader, SidebarPanelRowActionsContainer } from '..'
import { FormFetcherIcon } from '../form/fetcher/icon'

type PanelEntityType = designTypeEnum
type PanelEntityParent = IArtboardVersionWithDesignsAndLayers

export const PanelEntityHeader = ({
	type,
	parentTypeId,
	parent,
	strategyEntityNew,
}: {
	type: PanelEntityType
	parentTypeId: designParentTypeIdEnum
	parent: PanelEntityParent
	strategyEntityNew: IDashboardPanelCreateEntityStrategy
}) => {
	return (
		<SidebarPanelHeader title={capitalize(type)}>
			<SidebarPanelRowActionsContainer>
				<FormFetcherIcon
					type={type}
					parentTypeId={parentTypeId}
					parentId={parent.id}
					route={strategyEntityNew.route}
					formId={strategyEntityNew.formId}
					schema={strategyEntityNew.schema}
					icon="plus"
					iconText={strategyEntityNew.iconText}
				/>
			</SidebarPanelRowActionsContainer>
		</SidebarPanelHeader>
	)
}
