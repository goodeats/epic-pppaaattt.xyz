import { type User } from '@prisma/client'
import { type IDesignCreatedResponse } from '#app/models/design/design.create.server'
import {
	type IDesignCreateOverrides,
	type IDesignTypeCreateOverrides,
} from '#app/models/design/design.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { type designTypeEnum } from '#app/schema/design'
import { LayerCreateDesignStrategy } from '#app/strategies/design/create.strategy'
import { LayerUpdateSelectedDesignStrategy } from '#app/strategies/design/update-selected.strategy'
import { designCreateService } from '../../design/create.service'

export const layerDesignCreateService = async ({
	userId,
	layerId,
	type,
	designOverrides = {},
	designTypeOverrides = {},
}: {
	userId: User['id']
	layerId: ILayer['id']
	type: designTypeEnum
	designOverrides?: IDesignCreateOverrides
	designTypeOverrides?: IDesignTypeCreateOverrides
}): Promise<IDesignCreatedResponse> => {
	try {
		const strategy = new LayerCreateDesignStrategy()
		const updateSelectedDesignStrategy = new LayerUpdateSelectedDesignStrategy()
		return designCreateService({
			userId,
			targetEntityId: layerId,
			type,
			designOverrides: designOverrides || {},
			designTypeOverrides: designTypeOverrides || {},
			strategy,
			updateSelectedDesignStrategy,
		})
	} catch (error) {
		console.log('layerDesignCreateService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
