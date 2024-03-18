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
import {
	artboardSelectedDesignIdsToArray,
	artboardSelectedDesignsCompleted,
} from '#app/utils/artboard'
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
		const isCompleted = artboardSelectedDesignsCompleted({ artboard })
		if (!isCompleted) throw new Error('Artboard designs are not completed')

		const artboarSelectedDesignIdsArray = artboardSelectedDesignIdsToArray({
			artboard,
		})

		const artboardSelectedDesigns = await getSelectedDesignsForArtboard({
			artboardId: artboard.id,
			designIds: artboarSelectedDesignIdsArray,
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
	designIds,
	artboard,
}: {
	artboardId: string
	designIds: string[]
	artboard: PickedArtboardType
}): Promise<IArtboardLayerBuild> => {
	const designs = await getDesigns({ artboardId, ids: designIds })
	const palette = findPaletteInDesignArray({ designs })
	if (!palette) throw new Error('Palette not found')
	const size = findSizeInDesignArray({ designs })
	if (!size) throw new Error('Size not found')
	const fill = findFillInDesignArray({ designs })
	if (!fill) throw new Error('Fill not found')
	const stroke = findStrokeInDesignArray({ designs })
	if (!stroke) throw new Error('Stroke not found')
	const line = findLineInDesignArray({ designs })
	if (!line) throw new Error('Line not found')
	const rotate = findRotateInDesignArray({ designs })
	if (!rotate) throw new Error('Rotate not found')
	const layout = findLayoutInDesignArray({ designs })
	if (!layout) throw new Error('Layout not found')
	const template = findTemplateInDesignArray({ designs })
	if (!template) throw new Error('Template not found')

	const { width, height } = artboard
	const container = {
		width,
		height,
		top: 0,
		left: 0,
		margin: 0,
	}

	return {
		palette,
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

const getDesigns = async ({
	artboardId,
	ids,
}: {
	artboardId: string
	ids: string[]
}) => {
	return findManyDesignsWithType({ where: { artboardId, id: { in: ids } } })
}

const getSelectedDesignTypesForLayers = async ({
	layers,
	artboardSelectedDesigns,
}: {
	layers: ILayer[]
	artboardSelectedDesigns: IArtboardLayerBuild
}) => {
	return layers.map(layer => {
		// just return the artboard designs until they are used on layer
		return artboardSelectedDesigns
	})
}
