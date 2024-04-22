import { type User } from '@sentry/remix'
import {
	type IDesignTypeStrokeUpdatedResponse,
	updateDesignTypeStrokeBasis,
	updateDesignTypeStrokeStyle,
	updateDesignTypeStrokeValue,
} from '#app/models/design-type/design-type.update.stroke.server'
import { type IDesign } from '#app/models/design.server'
import { type IStroke } from '#app/models/stroke.server'

export const updateDesignTypeStrokeValueService = async ({
	userId,
	id,
	designId,
	value,
}: {
	userId: User['id']
	id: IStroke['id']
	designId: IDesign['id']
	value: number
}): Promise<IDesignTypeStrokeUpdatedResponse> => {
	try {
		return await updateDesignTypeStrokeValue({
			id,
			designId,
			value,
		})
		// later will be adding Activity class
		// i.e, edit history so you can undo changes and/or see who made them
	} catch (error) {
		console.log('updateDesignTypeStrokeValueService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export const updateDesignTypeStrokeBasisService = async ({
	userId,
	id,
	designId,
	basis,
}: {
	userId: User['id']
	id: IStroke['id']
	designId: IDesign['id']
	basis: string
}): Promise<IDesignTypeStrokeUpdatedResponse> => {
	try {
		return await updateDesignTypeStrokeBasis({
			id,
			designId,
			basis,
		})
		// later will be adding Activity class
		// i.e, edit history so you can undo changes and/or see who made them
	} catch (error) {
		console.log('updateDesignTypeStrokeBasisService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export const updateDesignTypeStrokeStyleService = async ({
	userId,
	id,
	designId,
	style,
}: {
	userId: User['id']
	id: IStroke['id']
	designId: IDesign['id']
	style: string
}): Promise<IDesignTypeStrokeUpdatedResponse> => {
	try {
		return await updateDesignTypeStrokeStyle({
			id,
			designId,
			style,
		})
		// later will be adding Activity class
		// i.e, edit history so you can undo changes and/or see who made them
	} catch (error) {
		console.log('updateDesignTypeStrokeStyleService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
