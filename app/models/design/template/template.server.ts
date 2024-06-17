import { type DesignTypeEnum } from '#app/schema/design'
import { type IDesignSubmission, type IDesignParsed } from '../design.server'

export interface IDesignTemplate extends IDesignParsed {
	type: typeof DesignTypeEnum.TEMPLATE
	attributes: IDesignAttributesTemplate
}

export type IDesignTemplateStyle = 'triangle'

// when adding attributes to an design type,
// make sure it starts as optional or is set to a default value
// for when parsing the design from the deserializer
export interface IDesignAttributesTemplate {
	style?: IDesignTemplateStyle
}

export interface IDesignTemplateSubmission
	extends IDesignSubmission,
		IDesignAttributesTemplate {}
