import { type User } from '@prisma/client'
import { type IArtboard } from '#app/models/artboard.server'
import { type IDesign, type IDesignIdOrNull } from '#app/models/design.server'
import { ArtboardVersionUpdateSelectedDesignStrategy } from '#app/strategies/design/update-selected.strategy'
import { designMoveDownService } from '../../../design/move-down.service'

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
			targetEntityId: artboardId,
			updateSelectedDesignId,
			updateSelectedDesignStrategy,
		})
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}
