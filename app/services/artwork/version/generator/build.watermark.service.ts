import { type IGeneratorWatermark } from '#app/definitions/artwork-generator'
import { type IArtworkVersionWithChildren } from '#app/models/artwork-version/artwork-version.server'
import { prisma } from '#app/utils/db.server'

export const buildGeneratorWatermark = async ({
	version,
}: {
	version: IArtworkVersionWithChildren
}): Promise<IGeneratorWatermark | null> => {
	if (!version.watermark) return null

	const userInstagramUrl = await prisma.artworkBranch
		.findUnique({
			where: { id: version.branchId },
			select: {
				owner: {
					select: { sm_url_instagram: true },
				},
			},
		})
		.then(branch => branch?.owner?.sm_url_instagram)

	const text = userInstagramUrl
		? `@${userInstagramUrl.split('/').pop()}`
		: 'PPPAAATTT'

	return {
		text,
		color: version.watermarkColor,
	}
}
