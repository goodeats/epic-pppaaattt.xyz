export interface IAssetImageDrawGeneration {
	x: number
	y: number
	width: number
	height: number
}

export interface IAssetImageGeneration extends IAssetImageDrawGeneration {
	src: string
}
