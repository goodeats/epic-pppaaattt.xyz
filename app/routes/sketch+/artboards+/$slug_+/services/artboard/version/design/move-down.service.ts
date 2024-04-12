import { type User } from '@prisma/client'
import { type IArtboard } from '#app/models/artboard.server'
import { type IDesign, type IDesignIdOrNull } from '#app/models/design.server'
import { designMoveDownService } from '../../../design/move-down.service'
import { ArtboardVersionUpdateSelectedDesignStrategy } from './update-selected.service'

export const artboardDesignMoveDownService = async ({
	userId,
	id,
	artboardId,
	updateSelectedDesignId,
}: {
	userId: User['id']
	id: IDesign['id']
	artboardId: IArtboard['id']
	updateSelectedDesignId?: IDesignIdOrNull
}) => {
	try {
		const updateSelectedDesignStrategy =
			new ArtboardVersionUpdateSelectedDesignStrategy()
		return designMoveDownService({
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