import { type User } from '@prisma/client'
import { type IArtboardVersion } from '#app/models/artboard-version.server'
import { type IDesignCreatedResponse } from '#app/models/design/design.create.server'
import {
	type IDesignCreateOverrides,
	type IDesignTypeCreateOverrides,
} from '#app/models/design.server'
import { type designTypeEnum } from '#app/schema/design'
import { ArtboardVersionCreateDesignStrategy } from '#app/strategies/design/create.strategy'
import { ArtboardVersionUpdateSelectedDesignStrategy } from '#app/strategies/design/update-selected.strategy'
import { designCreateService } from '../../../design/create.service'

export const artboardVersionDesignCreateService = async ({
	userId,
	artboardVersionId,
	type,
	designOverrides = {},
	designTypeOverrides = {},
}: {
	userId: User['id']
	artboardVersionId: IArtboardVersion['id']
	type: designTypeEnum
	designOverrides?: IDesignCreateOverrides
	designTypeOverrides?: IDesignTypeCreateOverrides
}): Promise<IDesignCreatedResponse> => {
	try {
		const strategy = new ArtboardVersionCreateDesignStrategy()
		const updateSelectedDesignStrategy =
			new ArtboardVersionUpdateSelectedDesignStrategy()
		return await designCreateService({
			userId,
			targetEntityId: artboardVersionId,
			type,
			designOverrides: designOverrides || {},
			designTypeOverrides: designTypeOverrides || {},
			strategy,
			updateSelectedDesignStrategy,
		})
	} catch (error) {
		console.log('artboardVersionDesignCreateService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
