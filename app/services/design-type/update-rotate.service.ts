import { type User } from '@sentry/remix'
import {
	type IDesignTypeRotateUpdatedResponse,
	updateDesignTypeRotateValue,
	updateDesignTypeRotateBasis,
} from '#app/models/design-type/design-type.update.rotate.server'
import { type IDesign } from '#app/models/design.server'
import { type IRotate } from '#app/models/rotate.server'

export const updateDesignTypeRotateValueService = async ({
	userId,
	id,
	designId,
	value,
}: {
	userId: User['id']
	id: IRotate['id']
	designId: IDesign['id']
	value: number
}): Promise<IDesignTypeRotateUpdatedResponse> => {
	try {
		return await updateDesignTypeRotateValue({
			id,
			designId,
			value,
		})
		// later will be adding Activity class
		// i.e, edit history so you can undo changes and/or see who made them
	} catch (error) {
		console.log('updateDesignTypeRotateValueService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export const updateDesignTypeRotateBasisService = async ({
	userId,
	id,
	designId,
	basis,
}: {
	userId: User['id']
	id: IRotate['id']
	designId: IDesign['id']
	basis: string
}): Promise<IDesignTypeRotateUpdatedResponse> => {
	try {
		return await updateDesignTypeRotateBasis({
			id,
			designId,
			basis,
		})
		// later will be adding Activity class
		// i.e, edit history so you can undo changes and/or see who made them
	} catch (error) {
		console.log('updateDesignTypeRotateBasisService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
