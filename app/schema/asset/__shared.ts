import { z } from 'zod'

const MAX_NAME_LENGTH = 240
export const AssetNameSchema = z.string().max(MAX_NAME_LENGTH)

const MAX_DESCRIPTION_LENGTH = 255
export const AssetDescriptionSchema = z
	.string()
	.max(MAX_DESCRIPTION_LENGTH)
	.optional()
