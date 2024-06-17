import { ZodError } from 'zod'
import { DesignTypeEnum, type designTypeEnum } from '#app/schema/design'
import { orderLinkedItems } from '#app/utils/linked-list.utils'
import { safelyAssignValue } from '#app/utils/typescript-helpers'
import {
	type IDesignByType,
	type IDesign,
	type IDesignParsed,
	type IDesignsByTypeWithType,
	type IDesignTypeSelected,
	type IDesignTypeSelectedFiltered,
} from './design.server'
import { type IDesignFill } from './fill/fill.server'
import { parseDesignFillAttributes } from './fill/utils'
import { type IDesignLayout } from './layout/layout.server'
import { parseDesignLayoutAttributes } from './layout/utils'
import { type IDesignLine } from './line/line.server'
import { parseDesignLineAttributes } from './line/utils'
import { type IDesignPalette } from './palette/palette.server'
import { parseDesignPaletteAttributes } from './palette/utils'
import { type IDesignRotate } from './rotate/rotate.server'
import { parseDesignRotateAttributes } from './rotate/utils'
import { type IDesignSize } from './size/size.server'
import { parseDesignSizeAttributes } from './size/utils'
import { type IDesignStroke } from './stroke/stroke.server'
import { parseDesignStrokeAttributes } from './stroke/utils'
import { type IDesignTemplate } from './template/template.server'
import { parseDesignTemplateAttributes } from './template/utils'

export const deserializeDesigns = ({
	designs,
}: {
	designs: IDesign[]
}): IDesignParsed[] => {
	return designs.map(design => deserializeDesign({ design }))
}

export const deserializeDesign = ({
	design,
}: {
	design: IDesign
}): IDesignParsed => {
	const type = design.type as designTypeEnum
	const { attributes } = design

	const validatedDesignAttributes = validateDesignAttributes({
		type,
		attributes,
	})

	return {
		...design,
		type,
		attributes: validatedDesignAttributes,
	}
}

export const validateDesignAttributes = ({
	type,
	attributes,
}: {
	type: designTypeEnum
	attributes: IDesign['attributes']
}) => {
	try {
		switch (type) {
			case DesignTypeEnum.FILL:
				return parseDesignFillAttributes(attributes)
			case DesignTypeEnum.LAYOUT:
				return parseDesignLayoutAttributes(attributes)
			case DesignTypeEnum.LINE:
				return parseDesignLineAttributes(attributes)
			case DesignTypeEnum.PALETTE:
				return parseDesignPaletteAttributes(attributes)
			case DesignTypeEnum.ROTATE:
				return parseDesignRotateAttributes(attributes)
			case DesignTypeEnum.SIZE:
				return parseDesignSizeAttributes(attributes)
			case DesignTypeEnum.STROKE:
				return parseDesignStrokeAttributes(attributes)
			case DesignTypeEnum.TEMPLATE:
				return parseDesignTemplateAttributes(attributes)
			default:
				throw new Error(`Unsupported design type: ${type}`)
		}
	} catch (error: any) {
		if (error instanceof ZodError) {
			throw new Error(
				`Validation failed for design type ${type}: ${error.errors.map(e => e.message).join(', ')}`,
			)
		} else {
			throw new Error(
				`Unexpected error during validation for design type ${type}: ${error.message}`,
			)
		}
	}
}

export const filterDesignsVisible = ({
	designs,
}: {
	designs: IDesignParsed[]
}): IDesignParsed[] => {
	return designs.filter(design => design.visible)
}

export const filterDesignType = ({
	designs,
	type,
}: {
	designs: IDesignParsed[]
	type: designTypeEnum
}): IDesignParsed[] => {
	return designs.filter(design => design.type === type)
}

export const groupDesignsByType = ({
	designs,
}: {
	designs: IDesignParsed[]
}): IDesignByType => {
	const designFills = orderLinkedItems<IDesignParsed>(
		filterDesignType({
			designs,
			type: DesignTypeEnum.FILL,
		}),
	) as IDesignFill[]
	const designLayouts = orderLinkedItems<IDesignParsed>(
		filterDesignType({
			designs,
			type: DesignTypeEnum.LAYOUT,
		}),
	) as IDesignLayout[]
	const designLines = orderLinkedItems<IDesignParsed>(
		filterDesignType({
			designs,
			type: DesignTypeEnum.LINE,
		}),
	) as IDesignLine[]
	const designPalettes = orderLinkedItems<IDesignParsed>(
		filterDesignType({
			designs,
			type: DesignTypeEnum.PALETTE,
		}),
	) as IDesignPalette[]
	const designRotates = orderLinkedItems<IDesignParsed>(
		filterDesignType({
			designs,
			type: DesignTypeEnum.ROTATE,
		}),
	) as IDesignRotate[]
	const designSizes = orderLinkedItems<IDesignParsed>(
		filterDesignType({
			designs,
			type: DesignTypeEnum.SIZE,
		}),
	) as IDesignSize[]
	const designStrokes = orderLinkedItems<IDesignParsed>(
		filterDesignType({
			designs,
			type: DesignTypeEnum.STROKE,
		}),
	) as IDesignStroke[]
	const designTemplates = orderLinkedItems<IDesignParsed>(
		filterDesignType({
			designs,
			type: DesignTypeEnum.TEMPLATE,
		}),
	) as IDesignTemplate[]

	return {
		designFills,
		designLayouts,
		designLines,
		designPalettes,
		designRotates,
		designSizes,
		designStrokes,
		designTemplates,
	}
}

export const designsByTypeToPanelArray = ({
	designs,
}: {
	designs: IDesignByType
}): IDesignsByTypeWithType[] => {
	const {
		designFills,
		designLayouts,
		designLines,
		designPalettes,
		designRotates,
		designSizes,
		designStrokes,
		designTemplates,
	} = designs

	return [
		{
			type: DesignTypeEnum.FILL,
			designs: designFills,
		},
		{
			type: DesignTypeEnum.LAYOUT,
			designs: designLayouts,
		},
		{
			type: DesignTypeEnum.LINE,
			designs: designLines,
		},
		{
			type: DesignTypeEnum.PALETTE,
			designs: designPalettes,
		},
		{
			type: DesignTypeEnum.ROTATE,
			designs: designRotates,
		},
		{
			type: DesignTypeEnum.SIZE,
			designs: designSizes,
		},
		{
			type: DesignTypeEnum.STROKE,
			designs: designStrokes,
		},
		{
			type: DesignTypeEnum.TEMPLATE,
			designs: designTemplates,
		},
	]
}

// used from artwork create service
// get all selected designs by type for artwork and each layer
// then separate them by type here
export const findFirstDesignsByTypeInArray = ({
	designs,
}: {
	designs: IDesignParsed[]
}): IDesignTypeSelected => {
	const fill =
		(filterDesignType({
			designs,
			type: DesignTypeEnum.FILL,
		})[0] as IDesignFill) || null
	const layout =
		(filterDesignType({
			designs,
			type: DesignTypeEnum.LAYOUT,
		})[0] as IDesignLayout) || null
	const line =
		(filterDesignType({
			designs,
			type: DesignTypeEnum.LINE,
		})[0] as IDesignLine) || null
	const palette =
		(filterDesignType({
			designs,
			type: DesignTypeEnum.PALETTE,
		})[0] as IDesignPalette) || null
	const rotate =
		(filterDesignType({
			designs,
			type: DesignTypeEnum.ROTATE,
		})[0] as IDesignRotate) || null
	const size =
		(filterDesignType({
			designs,
			type: DesignTypeEnum.SIZE,
		})[0] as IDesignSize) || null
	const stroke =
		(filterDesignType({
			designs,
			type: DesignTypeEnum.STROKE,
		})[0] as IDesignStroke) || null
	const template =
		(filterDesignType({
			designs,
			type: DesignTypeEnum.TEMPLATE,
		})[0] as IDesignTemplate) || null

	return {
		fill,
		layout,
		line,
		palette,
		rotate,
		size,
		stroke,
		template,
	}
}

// used from artwork generator create service
// layer generators will have artwork generator designs as default
// so only return the selected designs for layer to merge and override
export const filterSelectedDesignTypes = ({
	selectedDesignTypes,
}: {
	selectedDesignTypes: IDesignTypeSelected
}): IDesignTypeSelectedFiltered => {
	const filteredSelectedDesigns: Partial<IDesignTypeSelectedFiltered> = {}

	const designTypes = Object.keys(
		selectedDesignTypes,
	) as (keyof IDesignTypeSelected)[]

	for (const designType of designTypes) {
		const designValue = selectedDesignTypes[designType]

		if (designValue === null) continue

		safelyAssignValue(filteredSelectedDesigns, designType, designValue)
	}

	return filteredSelectedDesigns as IDesignTypeSelectedFiltered
}

// used from artwork generator create service
// verify artwork has all design types
// or canvas shouldn't be displayed
export const verifySelectedDesignTypesAllPresent = ({
	selectedDesignTypes,
}: {
	selectedDesignTypes: IDesignTypeSelected
}): {
	success: boolean
	message: string
} => {
	// set the design types to array from keys
	const designTypes = Object.keys(
		selectedDesignTypes,
	) as (keyof IDesignTypeSelected)[]

	// iterate through each design type
	for (const designType of designTypes) {
		// if the design type is not present
		if (!selectedDesignTypes[designType]) {
			// return an error message
			// with the design type in the message
			// indicating that the design type is missing
			return {
				success: false,
				message: `Please make a ${designType} design available for the artwork.`,
			}
		}
	}

	// if all design types are present
	return { success: true, message: 'All selected designs are present' }
}
