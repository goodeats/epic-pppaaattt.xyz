import { type User } from '@prisma/client'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import { type IDesignDeletedResponse } from '#app/models/design/design.delete.server'
import { type IDesignIdOrNull, type IDesign } from '#app/models/design/design.server'
import { ArtboardVersionUpdateSelectedDesignStrategy } from '#app/strategies/design/update-selected.strategy'
import { designDeleteService } from '../../../design/delete.service'

export const artboardVersionDesignDeleteService = async ({
	userId,
	id,
	artboardVersionId,
	updateSelectedDesignId,
}: {
	userId: User['id']
	id: IDesign['id']
	artboardVersionId: IArtboardVersion['id']
	updateSelectedDesignId: IDesignIdOrNull
}): Promise<IDesignDeletedResponse> => {
	try {
		const updateSelectedDesignStrategy =
			new ArtboardVersionUpdateSelectedDesignStrategy()
		return designDeleteService({
			userId,
			id,
			targetEntityId: artboardVersionId,
			updateSelectedDesignId,
			updateSelectedDesignStrategy,
		})
	} catch (error) {
		console.log('artboardVersionDesignDeleteService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
