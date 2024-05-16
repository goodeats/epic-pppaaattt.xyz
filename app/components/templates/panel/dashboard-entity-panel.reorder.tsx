import { memo, useCallback } from 'react'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import { type IDesign } from '#app/models/design/design.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { ArtboardVersionDesignReorder } from '#app/routes/resources+/api.v1+/artboard-version.design.update.order'
import { ArtboardVersionLayerReorder } from '#app/routes/resources+/api.v1+/artboard-version.layer.update.order'
import {
	EntityParentType,
	type entityParentTypeEnum,
	EntityType,
	type entityTypeEnum,
	type IEntity,
	type IEntityParentType,
} from '#app/schema/entity'
import { type IDashboardPanelUpdateEntityOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-order.strategy'
import { SidebarPanelRowReorderContainer } from '..'

interface ReorderChildEntityFormProps {
	entityType: entityTypeEnum
	parentType?: entityParentTypeEnum
	entity: IEntity
	parent: IEntityParentType
	atTop: boolean
	atBottom: boolean
}

const ArtboardVersionReorderChildEntityForm = memo(
	({
		entityType,
		entity,
		parent,
		atTop,
		atBottom,
	}: ReorderChildEntityFormProps) => {
		switch (entityType) {
			case EntityType.DESIGN:
				return (
					<>
						<ArtboardVersionDesignReorder
							design={entity as IDesign}
							version={parent as IArtboardVersion}
							direction="up"
							atTopOrBottom={atTop}
						/>
						<ArtboardVersionDesignReorder
							design={entity as IDesign}
							version={parent as IArtboardVersion}
							direction="down"
							atTopOrBottom={atBottom}
						/>
					</>
				)
			case EntityType.LAYER:
				return (
					<>
						<ArtboardVersionLayerReorder
							layer={entity as ILayer}
							version={parent as IArtboardVersion}
							direction="up"
							atTopOrBottom={atTop}
						/>
						<ArtboardVersionLayerReorder
							layer={entity as ILayer}
							version={parent as IArtboardVersion}
							direction="down"
							atTopOrBottom={atBottom}
						/>
					</>
				)
			default:
				console.log('unknown artboard version entity type', entityType)
				return null
		}
	},
)
ArtboardVersionReorderChildEntityForm.displayName =
	'ArtboardVersionReorderChildEntityForm'

const LayerReorderChildEntityForm = memo(
	({
		entityType,
		entity,
		parent,
		atTop,
		atBottom,
	}: ReorderChildEntityFormProps) => {
		switch (entityType) {
			case EntityType.DESIGN:
				return 'LMD'
			default:
				console.log('unknown layer entity type', entityType)
				return null
		}
	},
)
LayerReorderChildEntityForm.displayName = 'LayerReorderChildEntityForm'

const ReorderEntityForm = memo(
	({
		parentType,
		entityType,
		entity,
		parent,
		atTop,
		atBottom,
	}: ReorderChildEntityFormProps) => {
		switch (parentType) {
			case EntityParentType.ARTBOARD_VERSION:
				return (
					<ArtboardVersionReorderChildEntityForm
						entityType={entityType}
						entity={entity}
						parent={parent}
						atTop={atTop}
						atBottom={atBottom}
					/>
				)
			case EntityParentType.LAYER:
				return (
					<LayerReorderChildEntityForm
						entityType={entityType}
						entity={entity}
						parent={parent}
						atTop={atTop}
						atBottom={atBottom}
					/>
				)
			default:
				console.log('unknown parent type', parentType)
				return null
		}
	},
)
ReorderEntityForm.displayName = 'ReorderEntityForm'

export const PanelEntityRowReorder = ({
	entity,
	parent,
	atTop,
	atBottom,
	strategyReorder,
}: {
	entity: IEntity
	parent: IEntityParentType
	atTop: boolean
	atBottom: boolean
	strategyReorder: IDashboardPanelUpdateEntityOrderStrategy
}) => {
	const { entityType, parentType } = strategyReorder

	const reorderEntityForm = useCallback(
		() => (
			<ReorderEntityForm
				parentType={parentType}
				entityType={entityType}
				entity={entity}
				parent={parent}
				atTop={atTop}
				atBottom={atBottom}
			/>
		),
		[parentType, entityType, entity, parent, atTop, atBottom],
	)

	// return 'mv'
	return (
		<SidebarPanelRowReorderContainer>
			{reorderEntityForm()}
			{/* <FormFetcherMoveIcon
				entityId={entity.id}
				parentId={parent.id}
				parentTypeId={strategyReorder.parentTypeId}
				route={strategyReorder.route}
				formId={strategyReorder.formId}
				schema={strategyReorder.schema}
				direction="up"
				atTopOrBottom={atTop}
			/>
			<FormFetcherMoveIcon
				entityId={entity.id}
				parentId={parent.id}
				parentTypeId={strategyReorder.parentTypeId}
				route={strategyReorder.route}
				formId={strategyReorder.formId}
				schema={strategyReorder.schema}
				direction="down"
				atTopOrBottom={atBottom}
			/> */}
		</SidebarPanelRowReorderContainer>
	)
}
