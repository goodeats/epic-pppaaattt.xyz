import { type User } from '@sentry/remix'
import {
	type IDesignTypeLayoutUpdatedResponse,
	updateDesignTypeLayoutCount,
} from '#app/models/design-type/design-type.update.layout.server'
import { type IDesign } from '#app/models/design.server'
import { type ILayout } from '#app/models/layout.server'

export const updateDesignTypeLayoutCountService = async ({
	userId,
	id,
	designId,
	count,
}: {
	userId: User['id']
	id: ILayout['id']
	designId: IDesign['id']
	count: number
}): Promise<IDesignTypeLayoutUpdatedResponse> => {
	try {
		return await updateDesignTypeLayoutCount({
			id,
			designId,
			count,
		})
		// later will be adding Activity class
		// i.e, edit history so you can undo changes and/or see who made them
	} catch (error) {
		console.log('updateDesignTypeLayoutCountService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
