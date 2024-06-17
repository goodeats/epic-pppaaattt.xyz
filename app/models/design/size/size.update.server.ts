import { type IDesign, type IDesignUpdateData } from '../design.server'
import {
	type IDesignSizeSubmission,
	type IDesignAttributesSize,
	type IDesignSize,
} from './size.server'

export interface IDesignSizeUpdatedResponse {
	success: boolean
	message?: string
	updatedDesignSize?: IDesign
}

export interface IDesignSizeUpdateSubmission extends IDesignSizeSubmission {
	id: IDesignSize['id']
}

export interface IDesignSizeUpdateData extends IDesignUpdateData {
	attributes: IDesignAttributesSize
}
