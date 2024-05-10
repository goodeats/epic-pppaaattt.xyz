import { type User } from '@prisma/client'
import { type IArtboard } from '#app/models/artboard.server'
import { type IDesignCreatedResponse } from '#app/models/design/design.create.server'
import {
	type IDesignCreateOverrides,
	type IDesignTypeCreateOverrides,
} from '#app/models/design.server'
import { type designTypeEnum } from '#app/schema/design'
import { ArtboardCreateDesignStrategy } from '#app/strategies/design/create.strategy'
import { ArtboardUpdateSelectedDesignStrategy } from '#app/strategies/design/update-selected.strategy'
import { designCreateService } from '../../design/create.service'

export const artboardDesignCreateService = async ({
	userId,
	artboardId,
	type,
	designOverrides = {},
	designTypeOverrides = {},
}: {
	userId: User['id']
	artboardId: IArtboard['id']
	type: designTypeEnum
	designOverrides?: IDesignCreateOverrides
	designTypeOverrides?: IDesignTypeCreateOverrides
}): Promise<IDesignCreatedResponse> => {
	try {
		const strategy = new ArtboardCreateDesignStrategy()
		const updateSelectedDesignStrategy =
			new ArtboardUpdateSelectedDesignStrategy()
		return designCreateService({
			userId,
			targetEntityId: artboardId,
			type,
			designOverrides: designOverrides || {},
			designTypeOverrides: designTypeOverrides || {},
			strategy,
			updateSelectedDesignStrategy,
		})
	} catch (error) {
		console.log('artboardDesignCreateService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
