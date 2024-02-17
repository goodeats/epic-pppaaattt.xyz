import { z } from 'zod'
import { AppearanceType } from '#app/utils/appearances'

export const EditArtboardAppearanceOrderSchema = z.object({
	artboardId: z.string(),
	appearanceId: z.string(),
	appearanceType: z.nativeEnum(AppearanceType),
	direction: z.enum(['up', 'down']),
})
