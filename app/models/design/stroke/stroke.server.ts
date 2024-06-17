import { type DesignTypeEnum } from '#app/schema/design'
import { type IDesignSubmission, type IDesignParsed } from '../design.server'

export interface IDesignStroke extends IDesignParsed {
	type: typeof DesignTypeEnum.STROKE
	attributes: IDesignAttributesStroke
}

export type IDesignStrokeBasis =
	| 'defined'
	| 'random'
	| 'palette-selected'
	| 'palette-random'
	| 'palette-loop'
	| 'palette-loop-reverse'
	| 'pixel'

export type IDesignStrokeStyle = 'solid'

// when adding attributes to an design type,
// make sure it starts as optional or is set to a default value
// for when parsing the design from the deserializer
export interface IDesignAttributesStroke {
	basis: IDesignStrokeBasis
	style: IDesignStrokeStyle
	value: string
}

export interface IDesignStrokeSubmission
	extends IDesignSubmission,
		IDesignAttributesStroke {}
