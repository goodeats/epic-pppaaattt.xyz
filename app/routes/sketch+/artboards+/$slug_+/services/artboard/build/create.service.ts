import { type IArtboard } from '#app/models/artboard.server'
import { getArtboardVisiblePalettes } from '#app/models/design-artboard.server'
import { getLayerVisiblePalettes } from '#app/models/design-layer.server'
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

	const { width, height } = artboard
	const container = {
		width,
		height,
		top: 0,
		left: 0,
		margin: 0,
	}

	return {
		palette: palettes,
		size,
		fill,
		stroke,
		line,
		rotate,
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
				layerId: layer.id,
				artboardSelectedDesigns,
			}),
		),
	)
}

const getSelectedDesignTypesForLayer = async ({
	layerId,
	artboardSelectedDesigns,
}: {
	layerId: ILayer['id']
	artboardSelectedDesigns: IArtboardLayerBuild
}): Promise<IArtboardLayerBuild> => {
	const result = { ...artboardSelectedDesigns }

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
