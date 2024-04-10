import {
	type IGeneratorDesigns,
	type IArtboardGenerator,
	type ILayerGenerator,
} from '#app/definitions/artboard-generator'
import { type IArtboard } from '#app/models/artboard.server'
import {
	getArtboardVisiblePalettes,
	getArtboardVisibleRotates,
} from '#app/models/design-artboard.server'
import {
	getLayerVisiblePalettes,
	getLayerVisibleRotates,
} from '#app/models/design-layer.server'
import {
	findManyDesignsWithType,
	type IDesignWithType,
} from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { type rotateBasisTypeEnum } from '#app/schema/rotate'
import {
	findFirstDesignsByTypeInArray,
	verifySelectedDesignTypesAllPresent,
} from '#app/utils/design'
import { filterLayersVisible } from '#app/utils/layer.utils'
import { isArrayRotateBasisType } from '#app/utils/rotate'
import { type PickedArtboardType } from '../../../queries'

export const artboardBuildCreateService = async ({
	artboard,
	layers,
}: {
	artboard: PickedArtboardType
	layers: ILayer[]
}): Promise<IArtboardGenerator> => {
	try {
		// Step 1: verify artboard selected designs are all present
		const { artboardGeneratorDesigns, message } =
			await verifyArtboardGeneratorDesigns({
				artboard,
			})

		// Step 2: return failure with message if not
		if (!artboardGeneratorDesigns) {
			return {
				id: artboard.id,
				layers: [],
				success: false,
				message,
			}
		}

		// Step 3: build the artboard generator layer
		// which will be the global settings for all layers
		const artboardGeneratorLayer = await buildGeneratorArtboardLayer({
			artboardId: artboard.id,
			artboard,
			artboardGeneratorDesigns,
		})

		// Step 4: build the generator layers
		// each layer can override any of the global settings
		const generatorLayers = await buildGeneratorLayers({
			layers,
			artboardGeneratorLayer,
		})

		return {
			id: artboard.id,
			layers: generatorLayers,
			success: true,
			message: 'Artboard generator created successfully.',
		}
	} catch (error) {
		console.log(error)
		return {
			id: artboard.id,
			layers: [],
			success: false,
			message: 'Unknown error creating artboard generator.',
		}
	}
}

const verifyArtboardGeneratorDesigns = async ({
	artboard,
}: {
	artboard: PickedArtboardType
}): Promise<{
	artboardGeneratorDesigns: IGeneratorDesigns | null
	message: string
}> => {
	// Step 1: get all selected designs for the artboard
	const artboardSelectedDesigns = await getArtboardSelectedDesigns({
		artboardId: artboard.id,
	})

	// Step 2: split the selected designs into the first of each type
	const selectedDesignTypes = findFirstDesignsByTypeInArray({
		designs: artboardSelectedDesigns,
	})

	// Step 3: validate that all selected design types are present
	// message will indicate which design type is missing
	const { success, message } = verifySelectedDesignTypesAllPresent({
		selectedDesignTypes,
	})

	// Step 4: return failure with message if selected designs are not valid
	if (!success) {
		return {
			message,
			artboardGeneratorDesigns: null,
		}
	}

	// Step 5: reformat the selected designs to be generator designs
	// this is to ensure that the selected designs are not null
	const artboardGeneratorDesigns = {
		...selectedDesignTypes,
		palette: [selectedDesignTypes.palette],
	} as IGeneratorDesigns

	return {
		artboardGeneratorDesigns,
		message: 'Artboard generator designs are present.',
	}
}

const getArtboardSelectedDesigns = async ({
	artboardId,
}: {
	artboardId: IArtboard['id']
}): Promise<IDesignWithType[]> => {
	return await findManyDesignsWithType({
		where: { artboardId, selected: true },
	})
}

// default/global design settings for each layer
// layer can override any of these values
const buildGeneratorArtboardLayer = async ({
	artboardId,
	artboard,
	artboardGeneratorDesigns,
}: {
	artboardId: string
	artboard: PickedArtboardType
	artboardGeneratorDesigns: IGeneratorDesigns
}): Promise<ILayerGenerator> => {
	// get all visible palettes to use for fill or stroke
	const palettes = await getArtboardVisiblePalettes({ artboardId })

	// get all visible rotates to use for rotate if defined random
	// no defined random rotates and no rotates will default to 0 rotation
	const rotates = isArrayRotateBasisType(
		artboardGeneratorDesigns.rotate.basis as rotateBasisTypeEnum,
	)
		? await getArtboardVisibleRotates({ artboardId })
		: []

	const container = getArtboardContainer({ artboard })

	return {
		...artboardGeneratorDesigns,
		palette: palettes,
		rotates,
		container,
	}
}

const getArtboardContainer = ({
	artboard,
}: {
	artboard: PickedArtboardType
}) => {
	const { width, height } = artboard
	return {
		width,
		height,
		top: 0,
		left: 0,
		margin: 0,
		canvas: {
			width,
			height,
		},
	}
}

const buildGeneratorLayers = async ({
	layers,
	artboardGeneratorLayer,
}: {
	layers: ILayer[]
	artboardGeneratorLayer: ILayerGenerator
}) => {
	const visibleLayers = filterLayersVisible({ layers })

	return await Promise.all(
		visibleLayers.map(layer =>
			buildGeneratorLayer({
				layer,
				artboardGeneratorLayer,
			}),
		),
	)
}

const buildGeneratorLayer = async ({
	layer,
	artboardGeneratorLayer,
}: {
	layer: ILayer
	artboardGeneratorLayer: ILayerGenerator
}): Promise<ILayerGenerator> => {
	const { id, name, description } = layer
	const layerId = layer.id
	const result = {
		...artboardGeneratorLayer,
		id,
		name,
		description,
	}

	const designs = await getLayerSelectedDesigns({ layerId })
	const { size, fill, stroke, line, rotate, layout, template } =
		findFirstDesignsByTypeInArray({ designs })

	if (size) result.size = size
	if (fill) result.fill = fill
	if (stroke) result.stroke = stroke
	if (line) result.line = line
	if (rotate) result.rotate = rotate
	if (layout) result.layout = layout
	if (template) result.template = template

	// get all visible palettes to use for fill or stroke
	// if empty, then use the artboard palette
	const palettes = await getLayerVisiblePalettes({ layerId })
	if (palettes.length > 0) {
		result.palette = palettes
	}

	// get all visible rotates to use for rotate
	// if empty, then use the artboard rotate
	if (rotate && isArrayRotateBasisType(rotate.basis as rotateBasisTypeEnum)) {
		const rotates = await getLayerVisibleRotates({ layerId })
		if (rotates.length > 0) {
			result.rotates = rotates
		}
	}

	return result
}

const getLayerSelectedDesigns = async ({
	layerId,
}: {
	layerId: ILayer['id']
}) => {
	return await findManyDesignsWithType({
		where: { layerId, selected: true },
	})
}
