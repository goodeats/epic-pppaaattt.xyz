import { z } from 'zod'
import { type ObjectValues } from '#app/utils/typescript-helpers'

export const TemplateStyleTypeEnum = {
	TRIANGLE: 'triangle', // my only shape so far
	// add more styles here
} as const
export type templateStyleTypeEnum = ObjectValues<typeof TemplateStyleTypeEnum>
const TemplateStyleSchema = z.nativeEnum(TemplateStyleTypeEnum)

// use this to (de)serealize data to/from the db
// when adding attributes to an design type,
// make sure it starts as optional or is set to a default value
// for when parsing the design from the deserializer
export const DesignAttributesTemplateSchema = z.object({
	style: TemplateStyleSchema,
})

export const NewDesignTemplateSchema = z.object({
	visible: z.boolean(),
	selected: z.boolean(),
	style: TemplateStyleSchema.default(TemplateStyleTypeEnum.TRIANGLE),
})

export const EditDesignTemplateStyleSchema = z.object({
	id: z.string(),
	style: TemplateStyleSchema,
})

export const DeleteDesignTemplateSchema = z.object({
	id: z.string(),
})
