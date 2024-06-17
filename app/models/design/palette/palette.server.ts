import { type DesignTypeEnum } from '#app/schema/design'
import { type IDesignSubmission, type IDesignParsed } from '../design.server'

export interface IDesignPalette extends IDesignParsed {
	type: typeof DesignTypeEnum.PALETTE
	attributes: IDesignAttributesPalette
}

// when adding attributes to an design type,
// make sure it starts as optional or is set to a default value
// for when parsing the design from the deserializer
export interface IDesignAttributesPalette {
	value: string
}

export interface IDesignPaletteSubmission
	extends IDesignSubmission,
		IDesignAttributesPalette {}
