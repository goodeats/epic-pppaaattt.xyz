import { type User } from '@prisma/client'
import { type IArtboard } from '#app/models/artboard/artboard.server'
import { type IDesign, type IDesignIdOrNull } from '#app/models/design/design.server'
import { ArtboardUpdateSelectedDesignStrategy } from '#app/strategies/design/update-selected.strategy'
import { designToggleVisibleService } from '../../design/toggle-visible.service'

export const artboardDesignToggleVisibleService = async ({
	userId,
	id,
	artboardId,
	updateSelectedDesignId,
}: {
	userId: User['id']
	id: IDesign['id']
	artboardId: IArtboard['id']
	updateSelectedDesignId: IDesignIdOrNull
}) => {
	try {
		const updateSelectedDesignStrategy =
			new ArtboardUpdateSelectedDesignStrategy()
		return designToggleVisibleService({
			userId,
			id,
			targetEntityId: artboardId,
			updateSelectedDesignId,
			updateSelectedDesignStrategy,
		})
	} catch (error) {
		console.log('artboardDesignToggleVisibleService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
