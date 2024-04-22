import { z } from 'zod'
import { type ObjectValues } from '#app/utils/typescript-helpers'

export const TemplateStyleTypeEnum = {
	TRIANGLE: 'triangle', // my only shape so far
	// add more styles here
} as const
export type templateStyleTypeEnum = ObjectValues<typeof TemplateStyleTypeEnum>
const TemplateStyleSchema = z.nativeEnum(TemplateStyleTypeEnum)

export const TemplateDataSchema = z.object({
	designId: z.string(),
	style: TemplateStyleSchema.optional(),
})

export type DesignTemplateUpdateSchemaType =
	typeof EditDesignTemplateStyleSchema

export const EditDesignTemplateStyleSchema = z.object({
	id: z.string(),
	designId: z.string(),
	style: TemplateStyleSchema,
})
