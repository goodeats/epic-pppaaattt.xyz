import { type User } from '@prisma/client'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { type IDesignCreatedResponse } from '#app/models/design/design.create.server'
import {
	type IDesignCreateOverrides,
	type IDesignTypeCreateOverrides,
} from '#app/models/design/design.server'
import { type designTypeEnum } from '#app/schema/design'
import { ArtworkVersionCreateDesignStrategy } from '#app/strategies/design/create.strategy'
import { ArtworkVersionUpdateSelectedDesignStrategy } from '#app/strategies/design/update-selected.strategy'
import { designCreateService } from '../../../design/create.service'

export const artworkVersionDesignCreateService = async ({
	userId,
	artworkVersionId,
	type,
	designOverrides = {},
	designTypeOverrides = {},
}: {
	userId: User['id']
	artworkVersionId: IArtworkVersion['id']
	type: designTypeEnum
	designOverrides?: IDesignCreateOverrides
	designTypeOverrides?: IDesignTypeCreateOverrides
}): Promise<IDesignCreatedResponse> => {
	try {
		const strategy = new ArtworkVersionCreateDesignStrategy()
		const updateSelectedDesignStrategy =
			new ArtworkVersionUpdateSelectedDesignStrategy()

		const createdArtworkVersionDesign = await designCreateService({
			userId,
			targetEntityId: artworkVersionId,
			type,
			designOverrides: designOverrides || {},
			designTypeOverrides: designTypeOverrides || {},
			strategy,
			updateSelectedDesignStrategy,
		})
		return createdArtworkVersionDesign
	} catch (error) {
		console.log('artworkVersionDesignCreateService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
