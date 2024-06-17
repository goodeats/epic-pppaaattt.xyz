import { type IDesign, type IDesignUpdateData } from '../design.server'
import {
	type IDesignFillSubmission,
	type IDesignAttributesFill,
	type IDesignFill,
} from './fill.server'

export interface IDesignFillUpdatedResponse {
	success: boolean
	message?: string
	updatedDesignFill?: IDesign
}

export interface IDesignFillUpdateSubmission extends IDesignFillSubmission {
	id: IDesignFill['id']
}

export interface IDesignFillUpdateData extends IDesignUpdateData {
	attributes: IDesignAttributesFill
}
