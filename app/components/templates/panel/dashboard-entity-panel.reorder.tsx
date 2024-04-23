import {
  type entityParentIdTypeEnum,
  type IEntity,
  type IEntityParentType,
} from '#app/schema/entity'
import { type IDashboardPanelUpdateEntityOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-move.strategy'
import { SidebarPanelRowReorderContainer } from '..'
import { FormFetcherMoveIcon } from '../form/fetcher/move-icon'

export const PanelEntityRowReorder = ({
  entity,
  parentTypeId,
  parent,
  entityCount,
  entityIndex,
  strategyReorder,
}: {
  entity: IEntity
  parentTypeId: entityParentIdTypeEnum
  parent: IEntityParentType
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
