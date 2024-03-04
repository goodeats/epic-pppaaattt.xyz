import { z } from 'zod'

export const DesignTypeEnum = {
	PALETTE: 'palette',
	SIZE: 'size',
	// add more design types here
} as const
type ObjectValues<T> = T[keyof T]
type designTypeEnum = ObjectValues<typeof DesignTypeEnum>

export interface Design {
	type: designTypeEnum
	ownerId: string
	artboardId?: string
}

export const designSchema = z.object({
	type: z.nativeEnum(DesignTypeEnum),
	ownerId: z.string(),
	artboardId: z.string().optional(),
}) satisfies z.Schema<Design>

export const NewArtboardDesignSchema = z.object({
	artboardId: z.string(),
})

export type selectArgsType = z.infer<typeof selectArgs>
const selectArgs = z.object({
	id: z.boolean().optional(),
})

export type whereArgsType = z.infer<typeof whereArgs>
const whereArgs = z.object({
	id: z.string().optional(),
	ownerId: z.string().optional(),
	artboardId: z.string().optional(),
})

export type findDesignArgsType = z.infer<typeof findDesignArgs>
export const findDesignArgs = z.object({
	where: whereArgs,
	select: selectArgs.optional(),
})
