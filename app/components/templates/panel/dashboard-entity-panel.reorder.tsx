import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { type IDesignWithType } from '#app/models/design.server'
import { type designParentTypeIdEnum } from '#app/schema/design'
import { type IDashboardPanelUpdateEntityOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-move.strategy'
import { SidebarPanelRowReorderContainer } from '..'
import { FormFetcherMoveIcon } from '../form/fetcher/move-icon'

type PanelEntity = IDesignWithType
type PanelEntityParent = IArtboardVersionWithDesignsAndLayers

export const PanelEntityRowReorder = ({
	entity,
	parentTypeId,
	parent,
	entityCount,
	entityIndex,
	strategyReorder,
}: {
	entity: PanelEntity
	parentTypeId: designParentTypeIdEnum
	parent: PanelEntityParent
	entityCount: number
	entityIndex: number
	strategyReorder: IDashboardPanelUpdateEntityOrderStrategy
}) => {
	const atTop = entityIndex === 0
	const atBottom = entityIndex === entityCount - 1

	return (
		<SidebarPanelRowReorderContainer>
			<FormFetcherMoveIcon
				entityId={entity.id}
				parentTypeId={parentTypeId}
				parentId={parent.id}
				route={strategyReorder.route}
				formId={strategyReorder.formId}
				schema={strategyReorder.schema}
				direction="up"
				atTopOrBottom={atTop}
			/>
			<FormFetcherMoveIcon
				entityId={entity.id}
				parentTypeId={parentTypeId}
				parentId={parent.id}
				route={strategyReorder.route}
				formId={strategyReorder.formId}
				schema={strategyReorder.schema}
				direction="down"
				atTopOrBottom={atBottom}
			/>
		</SidebarPanelRowReorderContainer>
	)
}
