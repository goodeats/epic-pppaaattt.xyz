import { getDesignsWithType } from '#app/models/design/design.get.server'
import {
	type IDesignWithStroke,
	type IDesignWithFill,
	type IDesignWithType,
	type IDesignWithLayout,
	type IDesignWithLine,
	type IDesign,
	type IDesignWithPalette,
	type IDesignWithRotate,
	type IDesignWithSize,
	type IDesignWithTemplate,
} from '#app/models/design/design.server'
import { type IDesignAttributesFill } from '#app/models/design/fill/fill.server'
import { stringifyDesignFillAttributes } from '#app/models/design/fill/utils'
import { type IDesignAttributesLayout } from '#app/models/design/layout/layout.server'
import { stringifyDesignLayoutAttributes } from '#app/models/design/layout/utils'
import { type IDesignAttributesLine } from '#app/models/design/line/line.server'
import { stringifyDesignLineAttributes } from '#app/models/design/line/utils'
import { type IDesignAttributesPalette } from '#app/models/design/palette/palette.server'
import { stringifyDesignPaletteAttributes } from '#app/models/design/palette/utils'
import { type IDesignAttributesRotate } from '#app/models/design/rotate/rotate.server'
import { stringifyDesignRotateAttributes } from '#app/models/design/rotate/utils'
import { type IDesignAttributesSize } from '#app/models/design/size/size.server'
import { stringifyDesignSizeAttributes } from '#app/models/design/size/utils'
import { type IDesignAttributesStroke } from '#app/models/design/stroke/stroke.server'
import { stringifyDesignStrokeAttributes } from '#app/models/design/stroke/utils'
import { type IDesignAttributesTemplate } from '#app/models/design/template/template.server'
import { stringifyDesignTemplateAttributes } from '#app/models/design/template/utils'
import { DesignTypeEnum, type designTypeEnum } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'

// designs will have attributes string as json now
// new prisma migration created the following columns on design table:
// - attributes, updatedAt,

// the goal of this script:
// - for each design
// - - deserialize the attributes from the design type
// - - validate the attributes
// - - update the design with the validated attributes

// after this script runs, there is more work to do:
// - routing, ui, and api changes to support artboard versions and branches

// how to run:
// 1) add the folowing to package.json scripts:
// "data:migrate": "npx tsx ./prisma/data-migrations/populate-design-attributes-by-type.ts"
// 2) run `npm run data:migrate`
// 3) remove the script from package.json

export const populateDesignAttributesByType = async () => {
	console.log('populateDesignAttributesByType begin 🎬')

	// Step 1: remove all artboard branches and versions from previous runs
	await clear()

	// Step 2: get all designs
	const designs = await getDesigns()

	const designUpdatePromises: Promise<void>[] = []

	// Step 2: update each design with the correct attributes
	for (const design of designs) {
		const updatePromise = updateDesignAttributesPromise(design)
		designUpdatePromises.push(updatePromise)
	}

	// Step 3: wait for all updates to complete
	await Promise.all(designUpdatePromises)

	console.log('populateDesignAttributesByType end 🏁')
}

const clear = async () => {
	await prisma.design.updateMany({
		data: {
			attributes: '{}',
		},
	})
}

const getDesigns = async (): Promise<IDesignWithType[]> => {
	return await getDesignsWithType({ where: {} })
}

const updateDesignAttributesPromise = (design: IDesignWithType) => {
	switch (design.type) {
		case DesignTypeEnum.FILL:
			return updateDesignFillAttributes(design as IDesignWithFill)
		case DesignTypeEnum.LAYOUT:
			return updateDesignLayoutAttributes(design as IDesignWithLayout)
		case DesignTypeEnum.LINE:
			return updateDesignLineAttributes(design as IDesignWithLine)
		case DesignTypeEnum.PALETTE:
			return updateDesignPaletteAttributes(design as IDesignWithPalette)
		case DesignTypeEnum.ROTATE:
			return updateDesignRotateAttributes(design as IDesignWithRotate)
		case DesignTypeEnum.SIZE:
			return updateDesignSizeAttributes(design as IDesignWithSize)
		case DesignTypeEnum.STROKE:
			return updateDesignStrokeAttributes(design as IDesignWithStroke)
		case DesignTypeEnum.TEMPLATE:
			return updateDesignTemplateAttributes(design as IDesignWithTemplate)
		default:
			throw new Error(`Unsupported design type: ${design.type}`)
	}
}

const prismaUpdatePromise = ({
	id,
	type,
	attributes,
}: {
	id: IDesign['id']
	type: designTypeEnum
	attributes: string
}) => {
	return prisma.design
		.update({
			where: { id },
			data: { attributes },
		})
		.then(() => {
			console.log(`Updated design ${type} attributes for design ${id}`)
		})
		.catch(error => {
			console.error(
				`Failed to update design ${type} attributes for design ${id}`,
				error,
			)
		})
}

const updateDesignFillAttributes = (design: IDesignWithFill) => {
	const { id, fill } = design
	const { basis, style, value } = fill
	const json = {
		basis,
		style,
		value,
	} as IDesignAttributesFill
	const attributes = stringifyDesignFillAttributes(json)

	return prismaUpdatePromise({
		id,
		type: DesignTypeEnum.FILL,
		attributes,
	})
}

const updateDesignLayoutAttributes = (design: IDesignWithLayout) => {
	const { id, layout } = design
	const { style, count, rows, columns } = layout
	const json = {
		style,
		count,
		rows,
		columns,
	} as IDesignAttributesLayout
	const attributes = stringifyDesignLayoutAttributes(json)

	return prismaUpdatePromise({
		id,
		type: DesignTypeEnum.LAYOUT,
		attributes,
	})
}

const updateDesignLineAttributes = (design: IDesignWithLine) => {
	const { id, line } = design
	const { basis, format, width } = line
	const json = {
		basis,
		format,
		width,
	} as IDesignAttributesLine
	const attributes = stringifyDesignLineAttributes(json)

	return prismaUpdatePromise({
		id,
		type: DesignTypeEnum.LINE,
		attributes,
	})
}

const updateDesignPaletteAttributes = (design: IDesignWithPalette) => {
	const { id, palette } = design
	const { value } = palette
	const json = {
		value,
	} as IDesignAttributesPalette
	const attributes = stringifyDesignPaletteAttributes(json)

	return prismaUpdatePromise({
		id,
		type: DesignTypeEnum.PALETTE,
		attributes,
	})
}

const updateDesignRotateAttributes = (design: IDesignWithRotate) => {
	const { id, rotate } = design
	const { basis, value } = rotate
	const json = {
		basis,
		value,
	} as IDesignAttributesRotate
	const attributes = stringifyDesignRotateAttributes(json)

	return prismaUpdatePromise({
		id,
		type: DesignTypeEnum.ROTATE,
		attributes,
	})
}

const updateDesignSizeAttributes = (design: IDesignWithSize) => {
	const { id, size } = design
	const { basis, format, value } = size
	const json = {
		basis,
		format,
		value,
	} as IDesignAttributesSize
	const attributes = stringifyDesignSizeAttributes(json)

	return prismaUpdatePromise({
		id,
		type: DesignTypeEnum.SIZE,
		attributes,
	})
}

const updateDesignStrokeAttributes = (design: IDesignWithStroke) => {
	const { id, stroke } = design
	const { basis, style, value } = stroke
	const json = {
		basis,
		style,
		value,
	} as IDesignAttributesStroke
	const attributes = stringifyDesignStrokeAttributes(json)

	return prismaUpdatePromise({
		id,
		type: DesignTypeEnum.STROKE,
		attributes,
	})
}

const updateDesignTemplateAttributes = (design: IDesignWithTemplate) => {
	const { id, template } = design
	const { style } = template
	const json = {
		style,
	} as IDesignAttributesTemplate
	const attributes = stringifyDesignTemplateAttributes(json)

	return prismaUpdatePromise({
		id,
		type: DesignTypeEnum.TEMPLATE,
		attributes,
	})
}

await populateDesignAttributesByType()
