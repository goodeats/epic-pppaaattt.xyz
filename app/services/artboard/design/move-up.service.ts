import { type User } from '@prisma/client'
import { type IArtboard } from '#app/models/artboard.server'
import { type IDesignUpdatedResponse } from '#app/models/design/design.update.server'
import { type IDesign, type IDesignIdOrNull } from '#app/models/design.server'
import { ArtboardUpdateSelectedDesignStrategy } from '#app/strategies/design/update-selected.strategy'
import { designMoveUpService } from '../../design/move-up.service'

export const artboardDesignMoveUpService = async ({
	userId,
	id,
	artboardId,
	updateSelectedDesignId,
}: {
	userId: User['id']
	id: IDesign['id']
	artboardId: IArtboard['id']
	updateSelectedDesignId: IDesignIdOrNull
}): Promise<IDesignUpdatedResponse> => {
	try {
		const updateSelectedDesignStrategy =
			new ArtboardUpdateSelectedDesignStrategy()
		return designMoveUpService({
			userId,
			id,
			targetEntityId: artboardId,
			updateSelectedDesignId,
			updateSelectedDesignStrategy,
		})
	} catch (error) {
		console.log('artboardDesignMoveUpService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
