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
import { findFillInDesignArray } from '#app/models/fill.server'
import { type ILayer } from '#app/models/layer.server'
import { findLayoutInDesignArray } from '#app/models/layout.server'
import { findLineInDesignArray } from '#app/models/line.server'
import { findPaletteInDesignArray } from '#app/models/palette.server'
import { findRotateInDesignArray } from '#app/models/rotate.server'
import { findSizeInDesignArray } from '#app/models/size.server'
import { findStrokeInDesignArray } from '#app/models/stroke.server'
import { findTemplateInDesignArray } from '#app/models/template.server'
import { RotateBasisTypeEnum } from '#app/schema/rotate'
import { filterLayersVisible } from '#app/utils/layer.utils'
import {
	type IArtboardLayerBuild,
	type PickedArtboardType,
} from '../../../queries'

export const artboardBuildCreateService = async ({
	artboard,
	layers,
}: {
	artboard: PickedArtboardType
	layers: ILayer[]
}) => {
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
}): Promise<IArtboardLayerBuild> => {
	const designs = await getArtboardSelectedDesigns({ artboardId })
	const palette = findPaletteInDesignArray({ designs })
	const size = findSizeInDesignArray({ designs })
	const fill = findFillInDesignArray({ designs })
	const stroke = findStrokeInDesignArray({ designs })
	const line = findLineInDesignArray({ designs })
	const rotate = findRotateInDesignArray({ designs })
	const layout = findLayoutInDesignArray({ designs })
	const template = findTemplateInDesignArray({ designs })

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
	const rotates =
		rotate.basis === RotateBasisTypeEnum.DEFINED_RANDOM
			? await getArtboardVisibleRotates({ artboardId })
			: []

	const { width, height } = artboard
	const container = {
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
	artboardSelectedDesigns: IArtboardLayerBuild
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
	artboardSelectedDesigns: IArtboardLayerBuild
}): Promise<IArtboardLayerBuild> => {
	const layerId = layer.id
	const result = { layerId, layerName: layer.name, ...artboardSelectedDesigns }

	const designs = await getLayerSelectedDesigns({ layerId })
	const size = findSizeInDesignArray({ designs })
	const fill = findFillInDesignArray({ designs })
	const stroke = findStrokeInDesignArray({ designs })
	const line = findLineInDesignArray({ designs })
	const rotate = findRotateInDesignArray({ designs })
	const layout = findLayoutInDesignArray({ designs })
	const template = findTemplateInDesignArray({ designs })

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
	if (rotate?.basis === RotateBasisTypeEnum.DEFINED_RANDOM) {
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
