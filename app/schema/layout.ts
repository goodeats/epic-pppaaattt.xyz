import { z } from 'zod'

export const LayoutDataSchema = z.object({
	designId: z.string(),
	style: z.enum(['random', 'grid']).optional(),
	count: z.number().min(1).max(100_000).optional(),
	rows: z.number().min(1).max(200).optional(),
	columns: z.number().min(1).max(200).optional(),
})

export const EditDesignLayoutStyleSchema = z.object({
	id: z.string(),
	designId: z.string(),
	style: z.enum(['random', 'grid']),
})

export const EditDesignLayoutCountSchema = z.object({
	id: z.string(),
	designId: z.string(),
	count: z.number().min(1).max(100_000),
})

export const EditDesignLayoutRowsSchema = z.object({
	id: z.string(),
	designId: z.string(),
	rows: z.number().min(1).max(200),
})

export const EditDesignLayoutColumnsSchema = z.object({
	id: z.string(),
	designId: z.string(),
	columns: z.number().min(1).max(200),
})

export const EditArtboardLayoutStyleSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	style: z.enum(['random', 'grid']),
})

export const EditArtboardLayoutCountSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	count: z.number().min(1).max(100_000),
})

export const EditArtboardLayoutRowsSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	rows: z.number().min(1).max(200),
})

export const EditArtboardLayoutColumnsSchema = z.object({
	id: z.string(),
	designId: z.string(),
	artboardId: z.string(),
	columns: z.number().min(1).max(200),
})
