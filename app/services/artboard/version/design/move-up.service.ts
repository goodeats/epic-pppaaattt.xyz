import { type User } from '@prisma/client'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import { type IDesignUpdatedResponse } from '#app/models/design/design.update.server'
import { type IDesign, type IDesignIdOrNull } from '#app/models/design.server'
import { ArtboardVersionUpdateSelectedDesignStrategy } from '#app/strategies/design/update-selected.strategy'
import { designMoveUpService } from '../../../design/move-up.service'

export const artboardVersionDesignMoveUpService = async ({
	userId,
	id,
	artboardVersionId,
	updateSelectedDesignId,
}: {
	userId: User['id']
	id: IDesign['id']
	artboardVersionId: IArtboardVersion['id']
	updateSelectedDesignId: IDesignIdOrNull
}): Promise<IDesignUpdatedResponse> => {
	try {
		const updateSelectedDesignStrategy =
			new ArtboardVersionUpdateSelectedDesignStrategy()
		return designMoveUpService({
			userId,
			id,
			targetEntityId: artboardVersionId,
			updateSelectedDesignId,
			updateSelectedDesignStrategy,
		})
	} catch (error) {
		console.log('artboardVersionDesignMoveUpService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
