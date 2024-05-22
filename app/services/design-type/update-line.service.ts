import { type IDesign } from '#app/models/design/design.server'
import { type ILine } from '#app/models/design-type/line/line.server'
import {
	type IDesignTypeLineUpdatedResponse,
	updateDesignTypeLineWidth,
	updateDesignTypeLineBasis,
	updateDesignTypeLineFormat,
} from '#app/models/design-type/line/line.update.server'
import { type IUser } from '#app/models/user/user.server'

export const updateDesignTypeLineWidthService = async ({
	userId,
	id,
	designId,
	width,
}: {
	userId: IUser['id']
	id: ILine['id']
	designId: IDesign['id']
	width: number
}): Promise<IDesignTypeLineUpdatedResponse> => {
	try {
		return await updateDesignTypeLineWidth({
			id,
			designId,
			width,
		})
		// later will be adding Activity class
		// i.e, edit history so you can undo changes and/or see who made them
	} catch (error) {
		console.log('updateDesignTypeLineWidthService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export const updateDesignTypeLineBasisService = async ({
	userId,
	id,
	designId,
	basis,
}: {
	userId: IUser['id']
	id: ILine['id']
	designId: IDesign['id']
	basis: string
}): Promise<IDesignTypeLineUpdatedResponse> => {
	try {
		return await updateDesignTypeLineBasis({
			id,
			designId,
			basis,
		})
		// later will be adding Activity class
		// i.e, edit history so you can undo changes and/or see who made them
	} catch (error) {
		console.log('updateDesignTypeLineBasisService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export const updateDesignTypeLineFormatService = async ({
	userId,
	id,
	designId,
	format,
}: {
	userId: IUser['id']
	id: ILine['id']
	designId: IDesign['id']
	format: string
}): Promise<IDesignTypeLineUpdatedResponse> => {
	try {
		return await updateDesignTypeLineFormat({
			id,
			designId,
			format,
		})
		// later will be adding Activity class
		// i.e, edit history so you can undo changes and/or see who made them
	} catch (error) {
		console.log('updateDesignTypeLineFormatService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
