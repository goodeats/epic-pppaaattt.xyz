import {
	type IGeneratorDesigns,
	type ILayerGenerator,
} from '#app/definitions/artwork-generator'
import { type IArtworkVersionWithChildren } from '#app/models/artwork-version/artwork-version.server'
import { filterAssetsVisible, groupAssetsByType } from '#app/models/asset/utils'
import { findManyDesignsWithType } from '#app/models/design/design.get.server'
import { getArtworkVersionVisiblePalettes } from '#app/models/design-artwork-version/design-artwork-version.server'
import { getLayerVisiblePalettes } from '#app/models/design-layer/design-layer.server'
import { type ILayerWithChildren } from '#app/models/layer/layer.server'
import {
	filterSelectedDesignTypes,
	findFirstDesignsByTypeInArray,
} from '#app/utils/design'
import { filterLayersVisible } from '#app/utils/layer.utils'
import { orderLinkedItems } from '#app/utils/linked-list.utils'
import { getArtworkVersionContainer } from './build.container.service'
import { getRotates } from './build.rotates.service'

// default/global design settings for each layer
// layer can override any of these values
export const buildDefaultGeneratorLayer = async ({
	version,
	defaultGeneratorDesigns,
}: {
	version: IArtworkVersionWithChildren
	defaultGeneratorDesigns: IGeneratorDesigns
}): Promise<ILayerGenerator> => {
	const artworkVersionId = version.id

	// get all visible palettes to use for fill or stroke
	const palettes = await getArtworkVersionVisiblePalettes({
		artworkVersionId,
	})

	// get all visible rotates to use for rotate if visible random
	const rotates = await getRotates({
		artworkVersionId,
		rotate: defaultGeneratorDesigns.rotate,
	})

	// container defaults to version dimensions
	const container = getArtworkVersionContainer({ version })

	const assets = groupAssetsByType({ assets: version.assets })

	return {
		...defaultGeneratorDesigns,
		background: version.background,
		palette: palettes,
		rotates,
		container,
		assets,
	}
}

export const buildGeneratorLayers = async ({
	version,
	defaultGeneratorLayer,
}: {
	version: IArtworkVersionWithChildren
	defaultGeneratorLayer: ILayerGenerator
}) => {
	const orderedLayers = await orderLinkedItems<ILayerWithChildren>(
		version.layers,
	)
	const visibleLayers = filterLayersVisible({
		layers: orderedLayers,
	}) as ILayerWithChildren[]

	return await Promise.all(
		visibleLayers.map(layer =>
			buildGeneratorLayer({
				layer,
				defaultGeneratorLayer,
			}),
		),
	)
}

const buildGeneratorLayer = async ({
	layer,
	defaultGeneratorLayer,
}: {
	layer: ILayerWithChildren
	defaultGeneratorLayer: ILayerGenerator
}): Promise<ILayerGenerator> => {
	const layerId = layer.id

	// Step 1: get all selected designs for the layer
	const layerSelectedDesigns = await getLayerSelectedDesigns({ layerId })

	// Step 2: split the selected designs into the first of each type
	const selectedDesignTypes = findFirstDesignsByTypeInArray({
		designs: layerSelectedDesigns,
	})

	// Step 3: filter the selected designs that are present
	// separate the palette from the rest of the layer generator designs
	// if the layer has no palette we do not want to override the default palette
	const { palette, ...layerGeneratorDesigns } = filterSelectedDesignTypes({
		selectedDesignTypes,
	})

	// Step 4: initialize the generator layer
	// with the default generator layer
	// and the layer generator designs as overrides
	// and layer details
	const { id, name, description } = layer

	const assets = groupAssetsByType({
		assets: filterAssetsVisible({ assets: layer.assets }),
	})

	const layerGenerator = {
		...defaultGeneratorLayer,
		...layerGeneratorDesigns,
		id,
		name,
		description,
		assets,
	}

	// Step 5: get all visible palettes to use for fill or stroke
	// if empty, then use the default palette
	const palettes = await getLayerVisiblePalettes({ layerId })
	if (palettes.length > 0) {
		layerGenerator.palette = palettes
	}

	// Step 6: get all visible rotates to use for rotate if visible random
	// if empty, then use the default rotate
	const { rotate } = layerGeneratorDesigns
	if (rotate) {
		const rotates = await getRotates({
			layerId,
			rotate,
		})

		if (rotates.length > 0) {
			layerGenerator.rotates = rotates
		}
	}

	return layerGenerator
}

const getLayerSelectedDesigns = async ({
	layerId,
}: {
	layerId: ILayerWithChildren['id']
}) => {
	return await findManyDesignsWithType({
		where: { layerId, selected: true },
	})
}
