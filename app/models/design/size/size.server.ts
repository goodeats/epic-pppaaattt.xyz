import { type DesignTypeEnum } from '#app/schema/design'
import { type IDesignSubmission, type IDesignParsed } from '../design.server'

export interface IDesignSize extends IDesignParsed {
	type: typeof DesignTypeEnum.SIZE
	attributes: IDesignAttributesSize
}

export type IDesignSizeBasis =
	| 'width'
	| 'height'
	| 'canvas-width'
	| 'canvas-height'

export type IDesignSizeFormat = 'pixel' | 'percent'

// when adding attributes to an design type,
// make sure it starts as optional or is set to a default value
// for when parsing the design from the deserializer
export interface IDesignAttributesSize {
	basis: IDesignSizeBasis
	format: IDesignSizeFormat
	value: number
}

export interface IDesignSizeSubmission
	extends IDesignSubmission,
		IDesignAttributesSize {}
