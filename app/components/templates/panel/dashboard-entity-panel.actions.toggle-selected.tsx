import { memo, useCallback } from 'react'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { ArtboardVersionLayerToggleSelected } from '#app/routes/resources+/api.v1+/artboard-version.layer.update.selected'
import {
	type entityParentTypeEnum,
	type entityTypeEnum,
	type IEntityParentType,
	type IEntitySelectable,
	EntityType,
	EntityParentType,
} from '#app/schema/entity'
import { type IDashboardPanelSelectEntityStrategy } from '#app/strategies/component/dashboard-panel/update-entity-selected.strategy'

interface ToggleSelectedChildEntityFormProps {
	entityType: entityTypeEnum
	parentType?: entityParentTypeEnum
	entity: IEntitySelectable
	parent: IEntityParentType
}

const ArtboardVersionToggleSelectedChildEntityForm = memo(
	({ entityType, entity, parent }: ToggleSelectedChildEntityFormProps) => {
		switch (entityType) {
			case EntityType.LAYER:
				return (
					<ArtboardVersionLayerToggleSelected
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
ArtboardVersionToggleSelectedChildEntityForm.displayName =
	'ArtboardVersionToggleSelectedChildEntityForm'

const ToggleSelectedEntityForm = memo(
	({
		parentType,
		entityType,
		entity,
		parent,
	}: ToggleSelectedChildEntityFormProps) => {
		switch (parentType) {
			case EntityParentType.ARTBOARD_VERSION:
				return (
					<ArtboardVersionToggleSelectedChildEntityForm
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
ToggleSelectedEntityForm.displayName = 'ToggleSelectedEntityForm'

export const PanelEntityToggleSelectedAction = ({
	entity,
	parent,
	strategyEntitySelect,
}: {
	entity: IEntitySelectable
	parent: IEntityParentType
	strategyEntitySelect: IDashboardPanelSelectEntityStrategy
}) => {
	const { entityType, parentType } = strategyEntitySelect

	const toggleSelectedEntityForm = useCallback(
		() => (
			<ToggleSelectedEntityForm
				parentType={parentType}
				entityType={entityType}
				entity={entity}
				parent={parent}
			/>
		),
		[parentType, entityType, entity, parent],
	)

	return toggleSelectedEntityForm()
}
