import { type User } from '@sentry/remix'
import {
	type IDesignTypeSizeUpdatedResponse,
	updateDesignTypeSizeValue,
	updateDesignTypeSizeBasis,
	updateDesignTypeSizeFormat,
} from '#app/models/design-type/design-type.update.size.server'
import { type IDesign } from '#app/models/design.server'
import { type ISize } from '#app/models/size.server'

export const updateDesignTypeSizeValueService = async ({
	userId,
	id,
	designId,
	value,
}: {
	userId: User['id']
	id: ISize['id']
	designId: IDesign['id']
	value: number
}): Promise<IDesignTypeSizeUpdatedResponse> => {
	try {
		return await updateDesignTypeSizeValue({
			id,
			designId,
			value,
		})
		// later will be adding Activity class
		// i.e, edit history so you can undo changes and/or see who made them
	} catch (error) {
		console.log('updateDesignTypeSizeValueService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export const updateDesignTypeSizeBasisService = async ({
	userId,
	id,
	designId,
	basis,
}: {
	userId: User['id']
	id: ISize['id']
	designId: IDesign['id']
	basis: string
}): Promise<IDesignTypeSizeUpdatedResponse> => {
	try {
		return await updateDesignTypeSizeBasis({
			id,
			designId,
			basis,
		})
		// later will be adding Activity class
		// i.e, edit history so you can undo changes and/or see who made them
	} catch (error) {
		console.log('updateDesignTypeSizeBasisService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export const updateDesignTypeSizeFormatService = async ({
	userId,
	id,
	designId,
	format,
}: {
	userId: User['id']
	id: ISize['id']
	designId: IDesign['id']
	format: string
}): Promise<IDesignTypeSizeUpdatedResponse> => {
	try {
		return await updateDesignTypeSizeFormat({
			id,
			designId,
			format,
		})
		// later will be adding Activity class
		// i.e, edit history so you can undo changes and/or see who made them
	} catch (error) {
		console.log('updateDesignTypeSizeFormatService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}