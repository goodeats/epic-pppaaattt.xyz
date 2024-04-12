import { type User } from '@prisma/client'
import { type IDesignIdOrNull, type IDesign } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { LayerUpdateSelectedDesignStrategy } from '#app/strategies/design/update-selected.strategy'
import { designMoveUpService } from '../../design/move-up.service'

export const layerDesignMoveUpService = async ({
	userId,
	id,
	layerId,
	updateSelectedDesignId,
}: {
	userId: User['id']
	id: IDesign['id']
	layerId: ILayer['id']
	updateSelectedDesignId?: IDesignIdOrNull
}) => {
	try {
		const updateSelectedDesignStrategy = new LayerUpdateSelectedDesignStrategy()
		return designMoveUpService({
			userId,
			id,
			targetEntityId: layerId,
			updateSelectedDesignId,
			updateSelectedDesignStrategy,
		})
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}
