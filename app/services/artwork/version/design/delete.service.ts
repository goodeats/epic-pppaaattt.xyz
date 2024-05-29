import { type User } from '@prisma/client'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { type IDesignDeletedResponse } from '#app/models/design/design.delete.server'
import { type IDesign } from '#app/models/design/design.server'
import { ArtworkVersionUpdateSelectedDesignStrategy } from '#app/strategies/design/update-selected.strategy'
import { designDeleteService } from '../../../design/delete.service'

export const artworkVersionDesignDeleteService = async ({
	userId,
	id,
	artworkVersionId,
}: {
	userId: User['id']
	id: IDesign['id']
	artworkVersionId: IArtworkVersion['id']
}): Promise<IDesignDeletedResponse> => {
	try {
		const updateSelectedDesignStrategy =
			new ArtworkVersionUpdateSelectedDesignStrategy()
		return designDeleteService({
			userId,
			id,
			targetEntityId: artworkVersionId,
			updateSelectedDesignStrategy,
		})
	} catch (error) {
		console.log('artworkVersionDesignDeleteService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
