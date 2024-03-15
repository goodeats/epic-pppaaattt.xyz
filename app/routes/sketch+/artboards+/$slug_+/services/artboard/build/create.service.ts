import { findFillInDesignArray } from '#app/models/fill.server'
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
import { prisma } from '#app/utils/db.server'
import { type PickedArtboardType } from '../../../queries'

export const artboardBuildCreateService = async ({
	artboard,
}: {
	artboard: PickedArtboardType
}) => {
	try {
		const isCompleted = artboardSelectedDesignsCompleted({ artboard })
		if (!isCompleted) throw new Error('Artboard designs are not completed')

		const designIdsArray = artboardSelectedDesignIdsToArray({ artboard })

		const artboardDesignBuilds = await getArtboardDesignTypes({
			artboardId: artboard.id,
			designIds: designIdsArray,
		})

		const container = {
			width: artboard.width,
			height: artboard.height,
			top: 0,
			left: 0,
			margin: 0,
		}

		return {
			id: artboard.id,
			layers: [{ ...artboardDesignBuilds, container }],
		}
	} catch (error) {
		console.log(error)
		return null
	}
}

const getArtboardDesignTypes = async ({
	artboardId,
	designIds,
}: {
	artboardId: string
	designIds: string[]
}) => {
	const designs = await prisma.design.findMany({
		where: { artboardId, id: { in: designIds } },
		include: {
			palette: true,
			size: true,
			fill: true,
			stroke: true,
			line: true,
			rotate: true,
			layout: true,
			template: true,
		},
		orderBy: {
			type: 'asc',
		},
	})

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

	return { palette, size, fill, stroke, line, rotate, layout, template }
}
