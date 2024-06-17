import { invariant } from '@epic-web/invariant'
import { type IArtworkVersionGeneratorMetadata } from '#app/definitions/artwork-generator'
import { type IArtworkVersionWithChildren } from '#app/models/artwork-version/artwork-version.server'
import { prisma } from '#app/utils/db.server'

export const buildGeneratorMetadata = async ({
	version,
}: {
	version: IArtworkVersionWithChildren
}): Promise<IArtworkVersionGeneratorMetadata> => {
	const branch = await prisma.artworkBranch.findUnique({
		where: { id: version.branchId },
		select: {
			id: true,
			name: true,
			slug: true,
			description: true,
			artwork: {
				select: {
					id: true,
					name: true,
					slug: true,
					description: true,
					project: {
						select: {
							id: true,
							name: true,
							slug: true,
							description: true,
						},
					},
					owner: {
						select: {
							id: true,
							name: true,
							username: true,
						},
					},
				},
			},
		},
	})
	invariant(branch, `Branch not found for version ${version.id}`)
	const artwork = branch.artwork
	invariant(artwork, `Artwork not found for branch ${branch.id}`)
	const project = artwork.project
	invariant(project, `Project not found for artwork ${artwork.id}`)
	const owner = artwork.owner
	invariant(owner, `Owner not found for artwork ${artwork.id}`)

	return {
		// version
		versionId: version.id,
		versionName: version.name,
		versionSlug: version.slug,
		versionDescription: version.description,
		// branch
		branchId: version.branchId,
		branchName: branch.name,
		branchSlug: branch.slug,
		branchDescription: branch.description,
		// artwork
		artworkId: artwork.id,
		artworkName: artwork.name,
		artworkSlug: artwork.slug,
		artworkDescription: artwork.description,
		// project
		projectId: project.id,
		projectName: project.name,
		projectSlug: project.slug,
		projectDescription: project.description,
		// owner
		ownerId: owner.id,
		ownerName: owner.name,
		ownerUsername: owner.username,
	}
}
