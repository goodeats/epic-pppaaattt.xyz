import { z } from 'zod'
import { HexcodeSchema } from './colors'

export const EditArtboardFillSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	value: HexcodeSchema,
})
