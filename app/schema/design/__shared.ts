import { z } from 'zod'

export const DesignDataSchema = z.object({
	visible: z.boolean(),
	selected: z.boolean(),
	ownerId: z.string(),
})
