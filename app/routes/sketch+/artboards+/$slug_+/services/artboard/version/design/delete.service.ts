import { type User } from '@prisma/client'
import { type IArtboard } from '#app/models/artboard.server'
import { type IDesignIdOrNull, type IDesign } from '#app/models/design.server'
import { ArtboardVersionUpdateSelectedDesignStrategy } from '#app/strategies/design/update-selected.strategy'
import { designDeleteService } from '../../../design/delete.service'

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
		const updateSelectedDesignStrategy =
			new ArtboardVersionUpdateSelectedDesignStrategy()
		return designDeleteService({
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
