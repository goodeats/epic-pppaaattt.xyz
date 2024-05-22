import { memo, useCallback } from 'react'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import { type IDesign } from '#app/models/design/design.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { ArtboardVersionDesignToggleVisible } from '#app/routes/resources+/api.v1+/artboard-version.design.update.visible'
import { ArtboardVersionLayerToggleVisible } from '#app/routes/resources+/api.v1+/artboard-version.layer.update.visible'
import { LayerDesignToggleVisible } from '#app/routes/resources+/api.v1+/layer.design.update.visible'
import {
	type entityParentTypeEnum,
	type entityTypeEnum,
	type IEntityParentType,
	type IEntityVisible,
	EntityType,
	EntityParentType,
} from '#app/schema/entity'
import { type IDashboardPanelUpdateEntityVisibleStrategy } from '#app/strategies/component/dashboard-panel/update-entity-visible.strategy'

interface ToggleVisibleChildEntityFormProps {
	entityType: entityTypeEnum
	parentType?: entityParentTypeEnum
	entity: IEntityVisible
	parent: IEntityParentType
}

const ArtboardVersionToggleVisibleChildEntityForm = memo(
	({ entityType, entity, parent }: ToggleVisibleChildEntityFormProps) => {
		switch (entityType) {
			case EntityType.DESIGN:
				return (
					<ArtboardVersionDesignToggleVisible
						design={entity as IDesign}
						version={parent as IArtboardVersion}
					/>
				)
			case EntityType.LAYER:
				return (
					<ArtboardVersionLayerToggleVisible
						layer={entity as ILayer}
						version={parent as IArtboardVersion}
					/>
				)
			default:
				console.log('unknown artboard version entity type', entityType)
				return null
		}
	},
)
ArtboardVersionToggleVisibleChildEntityForm.displayName =
	'ArtboardVersionToggleVisibleChildEntityForm'

const LayerToggleVisibleChildEntityForm = memo(
	({ entityType, entity, parent }: ToggleVisibleChildEntityFormProps) => {
		switch (entityType) {
			case EntityType.DESIGN:
				return (
					<LayerDesignToggleVisible
						design={entity as IDesign}
						layer={parent as ILayer}
					/>
				)
			default:
				console.log('unknown layer entity type', entityType)
				return null
		}
	},
)
LayerToggleVisibleChildEntityForm.displayName =
	'LayerToggleVisibleChildEntityForm'

const ToggleVisibleEntityForm = memo(
	({
		parentType,
		entityType,
		entity,
		parent,
	}: ToggleVisibleChildEntityFormProps) => {
		switch (parentType) {
			case EntityParentType.ARTBOARD_VERSION:
				return (
					<ArtboardVersionToggleVisibleChildEntityForm
						entityType={entityType}
						entity={entity}
						parent={parent}
					/>
				)
			case EntityParentType.LAYER:
				return (
					<LayerToggleVisibleChildEntityForm
						entityType={entityType}
						entity={entity}
						parent={parent}
					/>
				)
			default:
				console.log('unknown parent type', parentType)
				return null
		}
	},
)
ToggleVisibleEntityForm.displayName = 'ToggleVisibleEntityForm'

export const PanelEntityToggleVisobleAction = ({
	entity,
	parent,
	strategyToggleVisible,
}: {
	entity: IEntityVisible
	parent: IEntityParentType
	strategyToggleVisible: IDashboardPanelUpdateEntityVisibleStrategy
}) => {
	const { entityType, parentType } = strategyToggleVisible

	const toggleVisibleEntityForm = useCallback(
		() => (
			<ToggleVisibleEntityForm
				parentType={parentType}
				entityType={entityType}
				entity={entity}
				parent={parent}
			/>
		),
		[parentType, entityType, entity, parent],
	)

	// return 'TV'
	return toggleVisibleEntityForm()
}
