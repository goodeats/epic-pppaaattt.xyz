import { type IDesign, type IDesignUpdateData } from '../design.server'
import {
	type IDesignLineSubmission,
	type IDesignAttributesLine,
	type IDesignLine,
} from './line.server'

export interface IDesignLineUpdatedResponse {
	success: boolean
	message?: string
	updatedDesignLine?: IDesign
}

export interface IDesignLineUpdateSubmission extends IDesignLineSubmission {
	id: IDesignLine['id']
}

export interface IDesignLineUpdateData extends IDesignUpdateData {
	attributes: IDesignAttributesLine
}
