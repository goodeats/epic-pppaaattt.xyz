import { type User } from '@prisma/client'
import { type IDesignIdOrNull, type IDesign } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { designDeleteService } from '../../design/delete.service'
import { LayerUpdateSelectedDesignStrategy } from './update-selected.service'

export const layerDesignDeleteService = async ({
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
		console.log('layerDesignDeleteService')
		const updateSelectedDesignStrategy = new LayerUpdateSelectedDesignStrategy()
		return designDeleteService({
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
