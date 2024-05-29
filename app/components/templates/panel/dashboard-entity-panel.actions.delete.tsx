import { memo, useCallback } from 'react'
import { type IDesign } from '#app/models/design/design.server'
import { ArtworkVersionDesignDelete } from '#app/routes/resources+/api.v1+/artwork-version.design.delete'
import { LayerDesignDelete } from '#app/routes/resources+/api.v1+/layer.design.delete'
import {
	type entityParentTypeEnum,
	type entityTypeEnum,
	type IEntityParentType,
	type IEntityVisible,
	EntityType,
	EntityParentType,
} from '#app/schema/entity'
import { type IDashboardPanelDeleteEntityStrategy } from '#app/strategies/component/dashboard-panel/delete-entity.strategy'

interface DeleteChildEntityFormProps {
	entityType: entityTypeEnum
	parentType?: entityParentTypeEnum
	entity: IEntityVisible
	parent: IEntityParentType
}

const ArtworkVersionDeleteChildEntityForm = memo(
	({ entityType, entity, parent }: DeleteChildEntityFormProps) => {
		switch (entityType) {
			case EntityType.DESIGN:
				return (
					<ArtworkVersionDesignDelete
						design={entity as IDesign}
						versionId={parent.id}
					/>
				)
			case EntityType.LAYER:
				// artwork version layer delete not on panel actions
				// could be too easy to click and create a cascade of actions
				// delete is inside popover
				// keeping this here so if it shows up somehow,
				// it will stick out sorely and this decision will be remembered
				return 'av l'
			default:
				console.log('unknown artwork version entity type', entityType)
				return null
		}
	},
)
ArtworkVersionDeleteChildEntityForm.displayName =
	'ArtworkVersionDeleteChildEntityForm'

const LayerDeleteChildEntityForm = memo(
	({ entityType, entity, parent }: DeleteChildEntityFormProps) => {
		switch (entityType) {
			case EntityType.DESIGN:
				return (
					<LayerDesignDelete design={entity as IDesign} layerId={parent.id} />
				)
			default:
				console.log('unknown layer entity type', entityType)
				return null
		}
	},
)
LayerDeleteChildEntityForm.displayName = 'LayerDeleteChildEntityForm'

const DeleteEntityForm = memo(
	({ parentType, entityType, entity, parent }: DeleteChildEntityFormProps) => {
		switch (parentType) {
			case EntityParentType.ARTWORK_VERSION:
				return (
					<ArtworkVersionDeleteChildEntityForm
						entityType={entityType}
						entity={entity}
						parent={parent}
					/>
				)
			case EntityParentType.LAYER:
				return (
					<LayerDeleteChildEntityForm
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
DeleteEntityForm.displayName = 'DeleteEntityForm'

export const PanelEntityDeleteAction = ({
	entity,
	parent,
	strategyEntityDelete,
}: {
	entity: IEntityVisible
	parent: IEntityParentType
	strategyEntityDelete: IDashboardPanelDeleteEntityStrategy
}) => {
	const { entityType, parentType } = strategyEntityDelete

	const deleteEntityForm = useCallback(
		() => (
			<DeleteEntityForm
				parentType={parentType}
				entityType={entityType}
				entity={entity}
				parent={parent}
			/>
		),
		[parentType, entityType, entity, parent],
	)

	return deleteEntityForm()
}
