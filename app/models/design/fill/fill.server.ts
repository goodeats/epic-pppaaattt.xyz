import { type DesignTypeEnum } from '#app/schema/design'
import { type IDesignSubmission, type IDesignParsed } from '../design.server'

export interface IDesignFill extends IDesignParsed {
	type: typeof DesignTypeEnum.FILL
	attributes: IDesignAttributesFill
}

export type IDesignFillBasis =
	| 'defined'
	| 'random'
	| 'palette-selected'
	| 'palette-random'
	| 'palette-loop'
	| 'palette-loop-reverse'
	| 'pixel'

export type IDesignFillStyle = 'solid' | 'none'

// when adding attributes to an design type,
// make sure it starts as optional or is set to a default value
// for when parsing the design from the deserializer
export interface IDesignAttributesFill {
	basis: IDesignFillBasis
	style: IDesignFillStyle
	value: string
}

export interface IDesignFillSubmission
	extends IDesignSubmission,
		IDesignAttributesFill {}
