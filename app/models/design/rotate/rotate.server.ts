import { type DesignTypeEnum } from '#app/schema/design'
import { type IDesignSubmission, type IDesignParsed } from '../design.server'

export interface IDesignRotate extends IDesignParsed {
	type: typeof DesignTypeEnum.ROTATE
	attributes: IDesignAttributesRotate
}

export type IDesignRotateArrayBasis =
	| 'visible-random'
	| 'visible-loop'
	| 'visible-loop-reverse'

export type IDesignRotateIndividualBasis =
	| 'defined'
	| 'random'
	| 'N'
	| 'NE'
	| 'E'
	| 'SE'
	| 'S'
	| 'SW'
	| 'W'
	| 'NW'

export type IDesignRotateBasis =
	| IDesignRotateIndividualBasis
	| IDesignRotateArrayBasis

export type IDesignRotateFormat = 'pixel' | 'percent'

// when adding attributes to an design type,
// make sure it starts as optional or is set to a default value
// for when parsing the design from the deserializer
export interface IDesignAttributesRotate {
	basis: IDesignRotateBasis
	value: number
}

export interface IDesignRotateSubmission
	extends IDesignSubmission,
		IDesignAttributesRotate {}
