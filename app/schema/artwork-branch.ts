import { z } from 'zod'

export const ArtworkBranchDataCreateSchema = z.object({
	ownerId: z.string(),
	artworkId: z.string(),
	parentId: z.string(),
	name: z.string().min(1).max(255),
	description: z.string().max(255),
	slug: z.string(),
})

export const NewArtworkBranchSchema = z.object({
	id: z.string(),
	artworkId: z.string(),
	// copy the current version to the new branch
	// could be the tail or an earlier version
	versionId: z.string(),
	name: z.string().min(1).max(255),
	description: z.string().max(255).optional(),
	parentId: z.string().optional(),
})
