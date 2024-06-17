import { type IAssetImage } from './image.server'

export interface IAssetImageSrcGeneration {
	id: IAssetImage['id']
	src: string
}

export interface IAssetImageDrawGeneration {
	x: number
	y: number
	width: number
	height: number
}

export interface IAssetImageGeneration
	extends IAssetImageSrcGeneration,
		IAssetImageDrawGeneration {
	hideOnDraw: boolean
}
