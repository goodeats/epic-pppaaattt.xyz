import { type ILayer } from '../layer.server'

export interface ILayerCreatedResponse {
	success: boolean
	message?: string
	createdLayer?: ILayer
}
