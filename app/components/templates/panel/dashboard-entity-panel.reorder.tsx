import { memo, useCallback } from 'react'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { type IDesign } from '#app/models/design/design.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { ArtworkVersionDesignReorder } from '#app/routes/resources+/api.v1+/artwork-version.design.update.order'
import { ArtworkVersionLayerReorder } from '#app/routes/resources+/api.v1+/artwork-version.layer.update.order'
import { LayerDesignReorder } from '#app/routes/resources+/api.v1+/layer.design.update.order'
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

const ArtworkVersionReorderChildEntityForm = memo(
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
						<ArtworkVersionDesignReorder
							design={entity as IDesign}
							version={parent as IArtworkVersion}
							direction="up"
							atTopOrBottom={atTop}
						/>
						<ArtworkVersionDesignReorder
							design={entity as IDesign}
							version={parent as IArtworkVersion}
							direction="down"
							atTopOrBottom={atBottom}
						/>
					</>
				)
			case EntityType.LAYER:
				return (
					<>
						<ArtworkVersionLayerReorder
							layer={entity as ILayer}
							version={parent as IArtworkVersion}
							direction="up"
							atTopOrBottom={atTop}
						/>
						<ArtworkVersionLayerReorder
							layer={entity as ILayer}
							version={parent as IArtworkVersion}
							direction="down"
							atTopOrBottom={atBottom}
						/>
					</>
				)
			default:
				console.log('unknown artwork version entity type', entityType)
				return null
		}
	},
)
ArtworkVersionReorderChildEntityForm.displayName =
	'ArtworkVersionReorderChildEntityForm'

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
				return (
					<>
						<LayerDesignReorder
							design={entity as IDesign}
							layer={parent as ILayer}
							direction="up"
							atTopOrBottom={atTop}
						/>
						<LayerDesignReorder
							design={entity as IDesign}
							layer={parent as ILayer}
							direction="down"
							atTopOrBottom={atBottom}
						/>
					</>
				)
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
			case EntityParentType.ARTWORK_VERSION:
				return (
					<ArtworkVersionReorderChildEntityForm
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

	return (
		<SidebarPanelRowReorderContainer>
			{reorderEntityForm()}
		</SidebarPanelRowReorderContainer>
	)
}
