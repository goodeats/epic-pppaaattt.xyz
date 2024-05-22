import { type IDesign } from '#app/models/design/design.server'
import { type ILayout } from '#app/models/design-type/layout/layout.server'
import {
	type IDesignTypeLayoutUpdatedResponse,
	updateDesignTypeLayoutCount,
	updateDesignTypeLayoutRows,
	updateDesignTypeLayoutColumns,
	updateDesignTypeLayoutStyle,
} from '#app/models/design-type/layout/layout.update.server'
import { type IUser } from '#app/models/user/user.server'

export const updateDesignTypeLayoutCountService = async ({
	userId,
	id,
	designId,
	count,
}: {
	userId: IUser['id']
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

export const updateDesignTypeLayoutRowsService = async ({
	userId,
	id,
	designId,
	rows,
}: {
	userId: IUser['id']
	id: ILayout['id']
	designId: IDesign['id']
	rows: number
}): Promise<IDesignTypeLayoutUpdatedResponse> => {
	try {
		return await updateDesignTypeLayoutRows({
			id,
			designId,
			rows,
		})
		// later will be adding Activity class
		// i.e, edit history so you can undo changes and/or see who made them
	} catch (error) {
		console.log('updateDesignTypeLayoutRowsService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export const updateDesignTypeLayoutColumnsService = async ({
	userId,
	id,
	designId,
	columns,
}: {
	userId: IUser['id']
	id: ILayout['id']
	designId: IDesign['id']
	columns: number
}): Promise<IDesignTypeLayoutUpdatedResponse> => {
	try {
		return await updateDesignTypeLayoutColumns({
			id,
			designId,
			columns,
		})
		// later will be adding Activity class
		// i.e, edit history so you can undo changes and/or see who made them
	} catch (error) {
		console.log('updateDesignTypeLayoutColumnsService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export const updateDesignTypeLayoutStyleService = async ({
	userId,
	id,
	designId,
	style,
}: {
	userId: IUser['id']
	id: ILayout['id']
	designId: IDesign['id']
	style: number
}): Promise<IDesignTypeLayoutUpdatedResponse> => {
	try {
		return await updateDesignTypeLayoutStyle({
			id,
			designId,
			style,
		})
		// later will be adding Activity class
		// i.e, edit history so you can undo changes and/or see who made them
	} catch (error) {
		console.log('updateDesignTypeLayoutStyleService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
