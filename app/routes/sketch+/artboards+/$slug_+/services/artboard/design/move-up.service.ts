import { type User } from '@prisma/client'
import { type IArtboard } from '#app/models/artboard.server'
import { type IDesign, type IDesignIdOrNull } from '#app/models/design.server'
import { designMoveUpService } from '../../design/move-up.service'
import { ArtboardUpdateSelectedDesignStrategy } from './update-selected.service'

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
}) => {
	try {
		console.log('artboard move up')
		const updateSelectedDesignStrategy =
			new ArtboardUpdateSelectedDesignStrategy()
		return designMoveUpService({
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
