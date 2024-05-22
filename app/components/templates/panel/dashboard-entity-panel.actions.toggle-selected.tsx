import { memo, useCallback } from 'react'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { type ILayer } from '#app/models/layer/layer.server'
import {
	type entityParentTypeEnum,
	type entityTypeEnum,
	type IEntityParentType,
	type IEntitySelectable,
	EntityType,
	EntityParentType,
} from '#app/schema/entity'
import { type IDashboardPanelSelectEntityStrategy } from '#app/strategies/component/dashboard-panel/update-entity-selected.strategy'
import { ArtworkVersionLayerToggleSelected } from '#app/routes/resources+/api.v1+/artwork-version.layer.update.selected'

interface ToggleSelectedChildEntityFormProps {
	entityType: entityTypeEnum
	parentType?: entityParentTypeEnum
	entity: IEntitySelectable
	parent: IEntityParentType
}

const ArtworkVersionToggleSelectedChildEntityForm = memo(
	({ entityType, entity, parent }: ToggleSelectedChildEntityFormProps) => {
		switch (entityType) {
			case EntityType.LAYER:
				return (
					<ArtworkVersionLayerToggleSelected
						layer={entity as ILayer}
						version={parent as IArtworkVersion}
					/>
				)
			default:
				console.log('unknown artwork version entity type', entityType)
				return null
		}
	},
)
ArtworkVersionToggleSelectedChildEntityForm.displayName =
	'ArtworkVersionToggleSelectedChildEntityForm'

const ToggleSelectedEntityForm = memo(
	({
		parentType,
		entityType,
		entity,
		parent,
	}: ToggleSelectedChildEntityFormProps) => {
		switch (parentType) {
			case EntityParentType.ARTWORK_VERSION:
				return (
					<ArtworkVersionToggleSelectedChildEntityForm
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
