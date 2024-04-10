import { type User } from '@prisma/client'
import { type IDesign, type IDesignIdOrNull } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { designMoveDownService } from '../../design/move-down.service'
import { LayerUpdateSelectedDesignStrategy } from './update-selected.service'

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
}) => {
	try {
		console.log('layer move down')
		const updateSelectedDesignStrategy = new LayerUpdateSelectedDesignStrategy()
		return designMoveDownService({
			userId,
			id,
			entityId: layerId,
			updateSelectedDesignId,
			updateSelectedDesignStrategy,
		})
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}
