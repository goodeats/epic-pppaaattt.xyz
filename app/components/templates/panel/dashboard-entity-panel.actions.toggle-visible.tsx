import { memo, useCallback } from 'react'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { type IAssetImage } from '#app/models/asset/image/image.server'
import { type IDesign } from '#app/models/design/design.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { ArtworkVersionDesignToggleVisible } from '#app/routes/resources+/api.v1+/artwork-version.design.update.visible'
import { ArtworkVersionLayerToggleVisible } from '#app/routes/resources+/api.v1+/artwork-version.layer.update.visible'
import { AssetImageArtworkVersionUpdateVisible } from '#app/routes/resources+/api.v1+/asset.image.artwork-version.update.visible'
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

const ArtworkVersionToggleVisibleChildEntityForm = memo(
	({ entityType, entity, parent }: ToggleVisibleChildEntityFormProps) => {
		switch (entityType) {
			case EntityType.ASSET:
				return (
					<AssetImageArtworkVersionUpdateVisible
						image={entity as IAssetImage}
						artworkVersion={parent as IArtworkVersion}
					/>
				)
			case EntityType.DESIGN:
				return (
					<ArtworkVersionDesignToggleVisible
						design={entity as IDesign}
						version={parent as IArtworkVersion}
					/>
				)
			case EntityType.LAYER:
				return (
					<ArtworkVersionLayerToggleVisible
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
ArtworkVersionToggleVisibleChildEntityForm.displayName =
	'ArtworkVersionToggleVisibleChildEntityForm'

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
			case EntityParentType.ARTWORK_VERSION:
				return (
					<ArtworkVersionToggleVisibleChildEntityForm
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
