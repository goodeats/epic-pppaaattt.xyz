import { type DesignTypeEnum } from '#app/schema/design'
import { type IDesignSubmission, type IDesignParsed } from '../design.server'

export interface IDesignLayout extends IDesignParsed {
	type: typeof DesignTypeEnum.LAYOUT
	attributes: IDesignAttributesLayout
}

export type IDesignLayoutStyle = 'random' | 'grid'

// when adding attributes to an design type,
// make sure it starts as optional or is set to a default value
// for when parsing the design from the deserializer
export interface IDesignAttributesLayout {
	style: IDesignLayoutStyle
	count: number
	rows: number
	columns: number
}

export interface IDesignLayoutSubmission
	extends IDesignSubmission,
		IDesignAttributesLayout {}
