import { type DesignTypeEnum } from '#app/schema/design'
import { type IDesignSubmission, type IDesignParsed } from '../design.server'

export interface IDesignLine extends IDesignParsed {
	type: typeof DesignTypeEnum.LINE
	attributes: IDesignAttributesLine
}

export type IDesignLineBasis =
	| 'size'
	| 'width'
	| 'height'
	| 'canvas-width'
	| 'canvas-height'

export type IDesignLineFormat = 'pixel' | 'percent'

// when adding attributes to an design type,
// make sure it starts as optional or is set to a default value
// for when parsing the design from the deserializer
export interface IDesignAttributesLine {
	basis?: IDesignLineBasis
	format?: IDesignLineFormat
	width?: number
}

export interface IDesignLineSubmission
	extends IDesignSubmission,
		IDesignAttributesLine {}
