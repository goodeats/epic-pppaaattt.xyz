import { type User } from '@prisma/client'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import {
	type IDesign,
	type IDesignIdOrNull,
} from '#app/models/design/design.server'
import { type IDesignUpdatedResponse } from '#app/models/design/design.update.server'
import { ArtworkVersionUpdateSelectedDesignStrategy } from '#app/strategies/design/update-selected.strategy'
import { designMoveDownService } from '../../../design/move-down.service'

export const artworkVersionDesignMoveDownService = async ({
	userId,
	id,
	artworkVersionId,
	updateSelectedDesignId,
}: {
	userId: User['id']
	id: IDesign['id']
	artworkVersionId: IArtworkVersion['id']
	updateSelectedDesignId?: IDesignIdOrNull
}): Promise<IDesignUpdatedResponse> => {
	try {
		const updateSelectedDesignStrategy =
			new ArtworkVersionUpdateSelectedDesignStrategy()
		return designMoveDownService({
			userId,
			id,
			targetEntityId: artworkVersionId,
			updateSelectedDesignId,
			updateSelectedDesignStrategy,
		})
	} catch (error) {
		console.log('artworkVersionDesignMoveDownService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
