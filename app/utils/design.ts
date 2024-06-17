import {
	type IDesignWithPalette,
	type IDesignType,
	type IDesignWithType,
	type IDesignWithSize,
	type IDesignWithFill,
	type IDesignWithStroke,
	type IDesignWithLine,
	type IDesignWithRotate,
	type IDesignWithLayout,
	type IDesignWithTemplate,
	type IDesignsByType,
	type ISelectedDesigns,
	type ISelectedDesignsFiltered,
	type IDesignsByTypeWithType,
} from '#app/models/design/design.server'
import { findFirstFillInDesignArray } from '#app/models/design-type/fill/fill.util'
import { findFirstLayoutInDesignArray } from '#app/models/design-type/layout/layout.util'
import { findFirstLineInDesignArray } from '#app/models/design-type/line/line.util'
import { findFirstPaletteInDesignArray } from '#app/models/design-type/palette/palette.util'
import { findFirstRotateInDesignArray } from '#app/models/design-type/rotate/rotate.util'
import { findFirstSizeInDesignArray } from '#app/models/design-type/size/size.util'
import { findFirstStrokeInDesignArray } from '#app/models/design-type/stroke/stroke.util'
import { findFirstTemplateInDesignArray } from '#app/models/design-type/template/template.util'
import { DesignTypeEnum, type designTypeEnum } from '#app/schema/design'
import { orderLinkedItems } from './linked-list.utils'
import { safelyAssignValue } from './typescript-helpers'

export const groupAndOrderDesignsByType = ({
	designs,
}: {
	designs: IDesignWithType[]
}): IDesignsByType => {
	const designPalettes = orderLinkedItems<IDesignType>(
		filterDesignsByType(designs, 'palette'),
	) as IDesignWithPalette[]
	const designSizes = orderLinkedItems<IDesignType>(
		filterDesignsByType(designs, 'size'),
	) as IDesignWithSize[]
	const designFills = orderLinkedItems<IDesignType>(
		filterDesignsByType(designs, 'fill'),
	) as IDesignWithFill[]
	const designStrokes = orderLinkedItems<IDesignType>(
		filterDesignsByType(designs, 'stroke'),
	) as IDesignWithStroke[]
	const designLines = orderLinkedItems<IDesignType>(
		filterDesignsByType(designs, 'line'),
	) as IDesignWithLine[]
	const designRotates = orderLinkedItems<IDesignType>(
		filterDesignsByType(designs, 'rotate'),
	) as IDesignWithRotate[]
	const designLayouts = orderLinkedItems<IDesignType>(
		filterDesignsByType(designs, 'layout'),
	) as IDesignWithLayout[]
	const designTemplates = orderLinkedItems<IDesignType>(
		filterDesignsByType(designs, 'template'),
	) as IDesignWithTemplate[]

	return {
		designPalettes,
		designSizes,
		designFills,
		designStrokes,
		designLines,
		designRotates,
		designLayouts,
		designTemplates,
	}
}

export const filterDesignsByType = (
	designs: IDesignWithType[],
	type: designTypeEnum,
): IDesignType[] => {
	const typeToPropertyMap: {
		[key in designTypeEnum]: keyof IDesignWithType | null
	} = {
		[DesignTypeEnum.PALETTE]: 'palette',
		[DesignTypeEnum.SIZE]: 'size',
		[DesignTypeEnum.FILL]: 'fill',
		[DesignTypeEnum.STROKE]: 'stroke',
		[DesignTypeEnum.LINE]: 'line',
		[DesignTypeEnum.ROTATE]: 'rotate',
		[DesignTypeEnum.LAYOUT]: 'layout',
		[DesignTypeEnum.TEMPLATE]: 'template',
	}

	const property = typeToPropertyMap[type]

	if (!property) {
		return designs // Or throw an error if the type is not recognized
	}

	return designs
		.filter(
			design => design.type === type.toLowerCase() && design[property] !== null,
		)
		.map(design => ({ ...design, [property]: design[property] as any }))
}

export const orderLinkedDesigns = (designs: IDesignType[]): IDesignType[] => {
	// Step 1: Find the head of the list
	const head = designs.find(design => !design.prevId)
	if (!head) return []

	// Step 2: Sequentially order the designs starting from the head
	const orderedDesigns: IDesignType[] = [head]
	let currentDesign = head
	while (currentDesign.nextId) {
		let nextId = currentDesign.nextId
		const nextDesign = designs.find(design => design.id === nextId)

		if (nextDesign) {
			orderedDesigns.push(nextDesign)
			currentDesign = nextDesign
		} else {
			break
		}
	}

	return orderedDesigns
}

export const filterVisibleDesigns = (designs: IDesignType[]): IDesignType[] => {
	return designs.filter(design => design.visible)
}

export const designsByTypeToPanelArray = ({
	designs,
}: {
	designs: IDesignsByType
}): IDesignsByTypeWithType[] => {
	const {
		designPalettes,
		designSizes,
		designFills,
		designStrokes,
		designLines,
		designRotates,
		designLayouts,
		designTemplates,
	} = designs

	return [
		{
			type: DesignTypeEnum.LAYOUT,
			designs: designLayouts,
		},
		{
			type: DesignTypeEnum.PALETTE,
			designs: designPalettes,
		},
		{
			type: DesignTypeEnum.SIZE,
			designs: designSizes,
		},
		{
			type: DesignTypeEnum.FILL,
			designs: designFills,
		},
		{
			type: DesignTypeEnum.STROKE,
			designs: designStrokes,
		},
		{
			type: DesignTypeEnum.LINE,
			designs: designLines,
		},
		{
			type: DesignTypeEnum.ROTATE,
			designs: designRotates,
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
	designs: IDesignWithType[]
}): ISelectedDesigns => {
	const palette = findFirstPaletteInDesignArray({ designs })
	const size = findFirstSizeInDesignArray({ designs })
	const fill = findFirstFillInDesignArray({ designs })
	const stroke = findFirstStrokeInDesignArray({ designs })
	const line = findFirstLineInDesignArray({ designs })
	const rotate = findFirstRotateInDesignArray({ designs })
	const layout = findFirstLayoutInDesignArray({ designs })
	const template = findFirstTemplateInDesignArray({ designs })

	return {
		palette,
		size,
		fill,
		stroke,
		line,
		rotate,
		layout,
		template,
	}
}

// used from artwork generator create service
// verify artwork has all design types
// or canvas shouldn't be displayed
export const verifySelectedDesignTypesAllPresent = ({
	selectedDesignTypes,
}: {
	selectedDesignTypes: ISelectedDesigns
}): {
	success: boolean
	message: string
} => {
	// set the design types to array from keys
	const designTypes = Object.keys(
		selectedDesignTypes,
	) as (keyof ISelectedDesigns)[]

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

// used from artwork generator create service
// layer generators will have artwork generator designs as default
// so only return the selected designs for layer to merge and override
export const filterSelectedDesignTypes = ({
	selectedDesignTypes,
}: {
	selectedDesignTypes: ISelectedDesigns
}): ISelectedDesignsFiltered => {
	const filteredSelectedDesigns: Partial<ISelectedDesignsFiltered> = {}

	const designTypes = Object.keys(
		selectedDesignTypes,
	) as (keyof ISelectedDesigns)[]

	for (const designType of designTypes) {
		const designValue = selectedDesignTypes[designType]

		if (designValue === null) continue

		safelyAssignValue(filteredSelectedDesigns, designType, designValue)
	}

	return filteredSelectedDesigns as ISelectedDesignsFiltered
}
