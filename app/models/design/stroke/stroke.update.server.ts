import { type IDesign, type IDesignUpdateData } from '../design.server'
import {
	type IDesignStrokeSubmission,
	type IDesignAttributesStroke,
	type IDesignStroke,
} from './stroke.server'

export interface IDesignStrokeUpdatedResponse {
	success: boolean
	message?: string
	updatedDesignStroke?: IDesign
}

export interface IDesignStrokeUpdateSubmission extends IDesignStrokeSubmission {
	id: IDesignStroke['id']
}

export interface IDesignStrokeUpdateData extends IDesignUpdateData {
	attributes: IDesignAttributesStroke
}
