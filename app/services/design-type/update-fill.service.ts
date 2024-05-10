import { type User } from '@sentry/remix'
import {
	type IDesignTypeFillUpdatedResponse,
	updateDesignTypeFillBasis,
	updateDesignTypeFillValue,
	updateDesignTypeFillStyle,
} from '#app/models/design-type/design-type.update.fill.server'
import { type IDesign } from '#app/models/design.server'
import { type IFill } from '#app/models/fill.server'

export const updateDesignTypeFillValueService = async ({
	userId,
	id,
	designId,
	value,
}: {
	userId: User['id']
	id: IFill['id']
	designId: IDesign['id']
	value: number
}): Promise<IDesignTypeFillUpdatedResponse> => {
	try {
		return await updateDesignTypeFillValue({
			id,
			designId,
			value,
		})
		// later will be adding Activity class
		// i.e, edit history so you can undo changes and/or see who made them
	} catch (error) {
		console.log('updateDesignTypeFillValueService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export const updateDesignTypeFillBasisService = async ({
	userId,
	id,
	designId,
	basis,
}: {
	userId: User['id']
	id: IFill['id']
	designId: IDesign['id']
	basis: string
}): Promise<IDesignTypeFillUpdatedResponse> => {
	try {
		return await updateDesignTypeFillBasis({
			id,
			designId,
			basis,
		})
		// later will be adding Activity class
		// i.e, edit history so you can undo changes and/or see who made them
	} catch (error) {
		console.log('updateDesignTypeFillBasisService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export const updateDesignTypeFillStyleService = async ({
	userId,
	id,
	designId,
	style,
}: {
	userId: User['id']
	id: IFill['id']
	designId: IDesign['id']
	style: string
}): Promise<IDesignTypeFillUpdatedResponse> => {
	try {
		return await updateDesignTypeFillStyle({
			id,
			designId,
			style,
		})
		// later will be adding Activity class
		// i.e, edit history so you can undo changes and/or see who made them
	} catch (error) {
		console.log('updateDesignTypeFillStyleService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
