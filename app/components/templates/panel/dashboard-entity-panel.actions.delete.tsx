import { memo, useCallback } from 'react'
import { ArtboardVersionDesignDelete } from '#app/routes/resources+/api.v1+/artboard-version.design.delete'
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

const ArtboardVersionDeleteChildEntityForm = memo(
	({ entityType, entity, parent }: DeleteChildEntityFormProps) => {
		switch (entityType) {
			case EntityType.DESIGN:
				// return 'av d'
				return (
					<ArtboardVersionDesignDelete
						designId={entity.id}
						versionId={parent.id}
					/>
				)
			case EntityType.LAYER:
				return 'av l'
			default:
				console.log('unknown artboard version entity type', entityType)
				return null
		}
	},
)
ArtboardVersionDeleteChildEntityForm.displayName =
	'ArtboardVersionDeleteChildEntityForm'

const LayerDeleteChildEntityForm = memo(
	({ entityType, parent }: DeleteChildEntityFormProps) => {
		switch (entityType) {
			case EntityType.DESIGN:
				return 'l d'
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
			case EntityParentType.ARTBOARD_VERSION:
				return (
					<ArtboardVersionDeleteChildEntityForm
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

	// return 'D'
	return deleteEntityForm()
	// return (
	// 	<FormFetcherIcon
	// 		entityId={entity.id}
	// 		parentId={parent.id}
	// 		parentTypeId={strategyEntityDelete.parentTypeId}
	// 		route={strategyEntityDelete.route}
	// 		formId={strategyEntityDelete.formId}
	// 		schema={strategyEntityDelete.schema}
	// 		icon="minus"
	// 		iconText={strategyEntityDelete.iconText}
	// 	/>
	// )
}
