import { ZodError } from 'zod'
import { type ILayerGeneratorContainer } from '#app/definitions/artwork-generator'
import { DesignAttributesSizeSchema } from '#app/schema/design/size'
import { SizeBasisTypeEnum } from '#app/schema/size'
import { type IDesignSize, type IDesignAttributesSize } from './size.server'

export const parseDesignSizeAttributes = (
	attributes: string,
): IDesignAttributesSize => {
	try {
		return DesignAttributesSizeSchema.parse(JSON.parse(attributes))
	} catch (error: any) {
		if (error instanceof ZodError) {
			throw new Error(
				`Validation failed for design size: ${error.errors.map(e => e.message).join(', ')}`,
			)
		} else {
			throw new Error(
				`Unexpected error during validation for design size: ${error.message}`,
			)
		}
	}
}

export const stringifyDesignSizeAttributes = (
	attributes: IDesignAttributesSize,
): string => {
	try {
		return JSON.stringify(DesignAttributesSizeSchema.parse(attributes))
	} catch (error: any) {
		if (error instanceof ZodError) {
			throw new Error(
				`Validation failed for design size: ${error.errors.map(e => e.message).join(', ')}`,
			)
		} else {
			throw new Error(
				`Unexpected error during validation for design size: ${error.message}`,
			)
		}
	}
}

export const sizePercentToPixel = ({
	size,
	container,
}: {
	size: IDesignSize
	container: ILayerGeneratorContainer
}) => {
	const { basis, value } = size.attributes
	const sizePercent = value / 100

	switch (basis) {
		case SizeBasisTypeEnum.WIDTH:
			return container.width * sizePercent
		case SizeBasisTypeEnum.HEIGHT:
			return container.height * sizePercent
		case SizeBasisTypeEnum.CANVAS_WIDTH:
			return container.canvas.width * sizePercent
		case SizeBasisTypeEnum.CANVAS_HEIGHT:
			return container.canvas.height * sizePercent
		default:
			// something went wrong
			return 0
	}
}
