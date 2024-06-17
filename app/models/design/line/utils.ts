import { ZodError } from 'zod'
import { type ILayerGeneratorContainer } from '#app/definitions/artwork-generator'
import { DesignAttributesLineSchema } from '#app/schema/design/line'
import { LineBasisTypeEnum } from '#app/schema/line'
import { degreesToRadians } from '../rotate/utils'
import { type IDesignSize } from '../size/size.server'
import { sizePercentToPixel } from '../size/utils'
import { type IDesignLine, type IDesignAttributesLine } from './line.server'

export const parseDesignLineAttributes = (
	attributes: string,
): IDesignAttributesLine => {
	try {
		return DesignAttributesLineSchema.parse(JSON.parse(attributes))
	} catch (error: any) {
		if (error instanceof ZodError) {
			throw new Error(
				`Validation failed for design line: ${error.errors.map(e => e.message).join(', ')}`,
			)
		} else {
			throw new Error(
				`Unexpected error during validation for design line: ${error.message}`,
			)
		}
	}
}

export const stringifyDesignLineAttributes = (
	attributes: IDesignAttributesLine,
): string => {
	try {
		return JSON.stringify(DesignAttributesLineSchema.parse(attributes))
	} catch (error: any) {
		if (error instanceof ZodError) {
			throw new Error(
				`Validation failed for design line: ${error.errors.map(e => e.message).join(', ')}`,
			)
		} else {
			throw new Error(
				`Unexpected error during validation for design line: ${error.message}`,
			)
		}
	}
}

export const linePercentToPixel = ({
	line,
	size,
	container,
}: {
	line: IDesignLine
	size: IDesignSize
	container: ILayerGeneratorContainer
}) => {
	const { width, basis } = line.attributes
	const linePercent = width / 100

	switch (basis) {
		case LineBasisTypeEnum.SIZE:
			const sizeValue = sizePercentToPixel({ size, container })
			return sizeValue * linePercent
		case LineBasisTypeEnum.WIDTH:
			return container.width * linePercent
		case LineBasisTypeEnum.HEIGHT:
			return container.height * linePercent
		case LineBasisTypeEnum.CANVAS_WIDTH:
			return container.canvas.width * linePercent
		case LineBasisTypeEnum.CANVAS_HEIGHT:
			return container.canvas.height * linePercent
		default:
			return 0
	}
}

// the miter extends beyond the line by the stroke width
// to account for the miter join, we need to calculate the stick out length
// so we can reduce the size of the line by this amount
export const calculateMiterStickOutLength = ({
	lineWidth,
	angle,
}: {
	lineWidth: number
	angle: number
}) => {
	// convert the base angle to radians
	const baseAngleRadians = degreesToRadians(angle / 2)

	// calculate the miter length
	const miterStickOutLength = lineWidth / 2 / Math.cos(baseAngleRadians)

	return miterStickOutLength
}
