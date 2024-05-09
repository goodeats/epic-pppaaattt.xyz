import { z } from 'zod'

export const ArtboardBranchDataCreateSchema = z.object({
	ownerId: z.string(),
	artboardId: z.string(),
	parentId: z.string(),
	name: z.string().min(1).max(255),
	description: z.string().max(255),
	slug: z.string(),
})

export const NewArtboardBranchSchema = z.object({
	id: z.string(),
	artboardId: z.string(),
	// copy the current version to the new branch
	// could be the tail or an earlier version
	versionId: z.string(),
	name: z.string().min(1).max(255),
	description: z.string().max(255).optional(),
	parentId: z.string().optional(),
})
