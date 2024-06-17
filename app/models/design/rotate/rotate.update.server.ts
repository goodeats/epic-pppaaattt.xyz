import { type IDesign, type IDesignUpdateData } from '../design.server'
import {
	type IDesignRotateSubmission,
	type IDesignAttributesRotate,
	type IDesignRotate,
} from './rotate.server'

export interface IDesignRotateUpdatedResponse {
	success: boolean
	message?: string
	updatedDesignRotate?: IDesign
}

export interface IDesignRotateUpdateSubmission extends IDesignRotateSubmission {
	id: IDesignRotate['id']
}

export interface IDesignRotateUpdateData extends IDesignUpdateData {
	attributes: IDesignAttributesRotate
}
