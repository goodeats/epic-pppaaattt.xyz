import {
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
import { findManyDesignsWithType } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { type rotateBasisTypeEnum } from '#app/schema/rotate'
import { findFirstDesignsByTypeInArray } from '#app/utils/design'
import { filterLayersVisible } from '#app/utils/layer.utils'
import { isArrayRotateBasisType } from '#app/utils/rotate'
import { type PickedArtboardType } from '../../../queries'

export const artboardBuildCreateService = async ({
	artboard,
	layers,
}: {
	artboard: PickedArtboardType
	layers: ILayer[]
}): Promise<IArtboardGenerator | null> => {
	try {
		const artboardSelectedDesigns = await getSelectedDesignsForArtboard({
			artboardId: artboard.id,
			artboard,
		})

		const visibleLayers = filterLayersVisible({ layers })
		const layersSelectedDesigns = await getSelectedDesignTypesForLayers({
			layers: visibleLayers,
			artboardSelectedDesigns,
		})

		return {
			id: artboard.id,
			layers: layersSelectedDesigns,
		}
	} catch (error) {
		console.log(error)
		return null
	}
}

const getSelectedDesignsForArtboard = async ({
	artboardId,
	artboard,
}: {
	artboardId: string
	artboard: PickedArtboardType
}): Promise<ILayerGenerator> => {
	const designs = await getArtboardSelectedDesigns({ artboardId })
	const { palette, size, fill, stroke, line, rotate, layout, template } =
		findFirstDesignsByTypeInArray({ designs })

	// when the artboard build model is formalized
	// these can just be verified as joins
	// not the prettiest code, but this works for now
	if (!palette) throw new Error('Palette not found') // still do this to make sure there is an available palette
	if (!size) throw new Error('Size not found')
	if (!fill) throw new Error('Fill not found')
	if (!stroke) throw new Error('Stroke not found')
	if (!line) throw new Error('Line not found')
	if (!rotate) throw new Error('Rotate not found')
	if (!layout) throw new Error('Layout not found')
	if (!template) throw new Error('Template not found')

	// get all visible palettes to use for fill or stroke
	const palettes = await getArtboardVisiblePalettes({ artboardId })

	// get all visible rotates to use for rotate if defined random
	// no defined random rotates and no rotates will default to 0 rotation
	const rotates = isArrayRotateBasisType(rotate.basis as rotateBasisTypeEnum)
		? await getArtboardVisibleRotates({ artboardId })
		: []

	const container = getContainer({ artboard })

	return {
		palette: palettes,
		size,
		fill,
		stroke,
		line,
		rotate,
		rotates,
		layout,
		template,
		container,
	}
}

const getContainer = ({ artboard }: { artboard: PickedArtboardType }) => {
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

const getArtboardSelectedDesigns = async ({
	artboardId,
}: {
	artboardId: IArtboard['id']
}) => {
	return await findManyDesignsWithType({
		where: { artboardId, selected: true },
	})
}

const getSelectedDesignTypesForLayers = async ({
	layers,
	artboardSelectedDesigns,
}: {
	layers: ILayer[]
	artboardSelectedDesigns: ILayerGenerator
}) => {
	return await Promise.all(
		layers.map(layer =>
			getSelectedDesignTypesForLayer({
				layer,
				artboardSelectedDesigns,
			}),
		),
	)
}

const getSelectedDesignTypesForLayer = async ({
	layer,
	artboardSelectedDesigns,
}: {
	layer: ILayer
	artboardSelectedDesigns: ILayerGenerator
}): Promise<ILayerGenerator> => {
	const { id, name, description } = layer
	const layerId = layer.id
	const result = {
		...artboardSelectedDesigns,
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
