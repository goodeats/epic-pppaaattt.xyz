import { memo, useCallback } from 'react'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { type IAssetImage } from '#app/models/asset/image/image.server'
import { type IDesign } from '#app/models/design/design.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { ArtworkVersionDesignDelete } from '#app/routes/resources+/api.v1+/artwork-version.design.delete'
import { AssetImageArtworkVersionDelete } from '#app/routes/resources+/api.v1+/asset.image.artwork-version.delete'
import { AssetImageLayerDelete } from '#app/routes/resources+/api.v1+/asset.image.layer.delete'
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
			case EntityType.ASSET:
				return (
					<AssetImageArtworkVersionDelete
						image={entity as IAssetImage}
						artworkVersion={parent as IArtworkVersion}
					/>
				)
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
			case EntityType.ASSET:
				return (
					<AssetImageLayerDelete
						image={entity as IAssetImage}
						layer={parent as ILayer}
					/>
				)
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
