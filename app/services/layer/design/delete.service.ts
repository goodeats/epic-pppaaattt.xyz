import { type User } from '@prisma/client'
import { type IDesign } from '#app/models/design/design.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { LayerUpdateSelectedDesignStrategy } from '#app/strategies/design/update-selected.strategy'
import { designDeleteService } from '../../design/delete.service'

export const layerDesignDeleteService = async ({
	userId,
	id,
	layerId,
}: {
	userId: User['id']
	id: IDesign['id']
	layerId: ILayer['id']
}) => {
	try {
		const updateSelectedDesignStrategy = new LayerUpdateSelectedDesignStrategy()
		return designDeleteService({
			userId,
			id,
			targetEntityId: layerId,
			updateSelectedDesignStrategy,
		})
	} catch (error) {
		console.log('layerDesignDeleteService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
