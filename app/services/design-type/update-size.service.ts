import { type IDesign } from '#app/models/design/design.server'
import { type ISize } from '#app/models/design-type/size/size.server'
import {
	type IDesignTypeSizeUpdatedResponse,
	updateDesignTypeSizeValue,
	updateDesignTypeSizeBasis,
	updateDesignTypeSizeFormat,
} from '#app/models/design-type/size/size.update.server'
import { type IUser } from '#app/models/user/user.server'

export const updateDesignTypeSizeValueService = async ({
	userId,
	id,
	designId,
	value,
}: {
	userId: IUser['id']
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
	userId: IUser['id']
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
	userId: IUser['id']
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
