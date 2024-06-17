import { ZodError } from 'zod'
import { DesignTypeEnum, type designTypeEnum } from '#app/schema/design'
import { type IDesign, type IDesignParsed } from './design.server'
import { parseDesignFillAttributes } from './fill/utils'
import { parseDesignLayoutAttributes } from './layout/utils'
import { parseDesignStrokeAttributes } from './stroke/utils'

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
			case DesignTypeEnum.STROKE:
				return parseDesignStrokeAttributes(attributes)
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

// export const groupDesignsByType = ({
// 	designs,
// }: {
// 	designs: IDesignParsed[]
// }): IDesignByType => {
// 	const DesignImages = filterDesignType({
// 		designs,
// 		type: DesignTypeEnum.IMAGE,
// 	}) as IDesignImage[]

// 	return {
// 		DesignImages,
// 	}
// }

// export const DesignsByTypeToPanelArray = ({
// 	designs,
// }: {
// 	designs: IDesignByType
// }): IDesignsByTypeWithType[] => {
// 	const { DesignImages } = designs

// 	return [
// 		{
// 			type: DesignTypeEnum.IMAGE,
// 			designs: DesignImages,
// 		},
// 	]
// }
