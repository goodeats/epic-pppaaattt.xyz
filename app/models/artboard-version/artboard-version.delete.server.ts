import { prisma } from '#app/utils/db.server'
import { type IArtboardVersion } from './artboard-version.server'

export interface IArtboardVersionDeletedResponse {
	success: boolean
	message?: string
}

export const deleteArtboardVersions = ({
	ids,
}: {
	ids: IArtboardVersion['id'][]
}) => {
	return prisma.artboardVersion.deleteMany({
		where: {
			id: {
				in: ids,
			},
		},
	})
}
