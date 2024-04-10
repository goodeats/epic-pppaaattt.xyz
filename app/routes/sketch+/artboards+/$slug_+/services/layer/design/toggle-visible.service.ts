import { type User } from '@prisma/client'
import { type IDesign, type IDesignIdOrNull } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { designToggleVisibleService } from '../../design/toggle-visible.service'
import { LayerUpdateSelectedDesignStrategy } from './update-selected.service'

export const layerDesignToggleVisibleService = async ({
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
		return designToggleVisibleService({
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
