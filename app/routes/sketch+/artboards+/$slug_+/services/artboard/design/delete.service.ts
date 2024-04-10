import { type User } from '@prisma/client'
import { type IArtboard } from '#app/models/artboard.server'
import { type IDesignIdOrNull, type IDesign } from '#app/models/design.server'
import { designDeleteService } from '../../design/delete.service'
import { ArtboardUpdateSelectedDesignStrategy } from './update-selected.service'

export const artboardDesignDeleteService = async ({
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
		console.log('artboardDesignDeleteService')
		const updateSelectedDesignStrategy =
			new ArtboardUpdateSelectedDesignStrategy()
		return designDeleteService({
			userId,
			id,
			entityId: artboardId,
			updateSelectedDesignId,
			updateSelectedDesignStrategy,
		})
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}
