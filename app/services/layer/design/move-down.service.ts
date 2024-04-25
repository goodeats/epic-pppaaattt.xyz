import { type User } from '@prisma/client'
import { type IDesignUpdatedResponse } from '#app/models/design/design.update.server'
import { type IDesign, type IDesignIdOrNull } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { LayerUpdateSelectedDesignStrategy } from '#app/strategies/design/update-selected.strategy'
import { designMoveDownService } from '../../design/move-down.service'

export const layerDesignMoveDownService = async ({
	userId,
	id,
	layerId,
	updateSelectedDesignId,
}: {
	userId: User['id']
	id: IDesign['id']
	layerId: ILayer['id']
	updateSelectedDesignId?: IDesignIdOrNull
}): Promise<IDesignUpdatedResponse> => {
	try {
		const updateSelectedDesignStrategy = new LayerUpdateSelectedDesignStrategy()
		return designMoveDownService({
			userId,
			id,
			targetEntityId: layerId,
			updateSelectedDesignId,
			updateSelectedDesignStrategy,
		})
	} catch (error) {
		console.log('layerDesignMoveDownService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}