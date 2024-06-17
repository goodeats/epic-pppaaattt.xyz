import { type IArtwork } from '#app/models/artwork/artwork.server'
import { type IArtworkBranch } from '#app/models/artwork-branch/artwork-branch.server'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { type IAssetGenerationByType } from '#app/models/asset/asset.generation.server'
import { type IAssetByType } from '#app/models/asset/asset.server'
import { type IFill } from '#app/models/design-type/fill/fill.server'
import { type ILayout } from '#app/models/design-type/layout/layout.server'
import { type ILine } from '#app/models/design-type/line/line.server'
import { type IPalette } from '#app/models/design-type/palette/palette.server'
import { type IRotate } from '#app/models/design-type/rotate/rotate.server'
import { type ISize } from '#app/models/design-type/size/size.server'
import { type IStroke } from '#app/models/design-type/stroke/stroke.server'
import { type ITemplate } from '#app/models/design-type/template/template.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { type IProject } from '#app/models/project/project.server'
import { type IUser } from '#app/models/user/user.server'

// object sent to the client
// generator has final building blocks for the generation(s)

export interface IArtworkVersionGenerator {
	id: IArtworkVersion['id']
	settings: {
		width: number
		height: number
		background: string
	}
	layers: ILayerGenerator[]
	watermark?: IGeneratorWatermark | null
	metadata?: IArtworkVersionGeneratorMetadata
	success: boolean
	message: string
}

export interface IArtworkVersionGeneratorMetadata {
	versionId: IArtworkVersion['id']
	versionName: IArtworkVersion['name']
	versionSlug: IArtworkVersion['slug']
	versionDescription: IArtworkVersion['description']
	branchId: IArtworkBranch['id']
	branchName: IArtworkBranch['name']
	branchSlug: IArtworkBranch['slug']
	branchDescription: IArtworkBranch['description']
	artworkId: IArtwork['id']
	artworkName: IArtwork['name']
	artworkSlug: IArtwork['slug']
	artworkDescription: IArtwork['description']
	projectId: IArtwork['projectId']
	projectName: IProject['name']
	projectSlug: IProject['slug']
	projectDescription: IProject['description']
	ownerId: IUser['id']
	ownerName: IUser['name']
	ownerUsername: IUser['username']
}

// layer can override or default to artwork version design types
export interface IGeneratorDesigns {
	palette: IPalette[]
	size: ISize
	fill: IFill
	stroke: IStroke
	line: ILine
	rotate: IRotate
	rotates?: IRotate[]
	layout: ILayout
	template: ITemplate
}

export interface ILayerGenerator extends IGeneratorDesigns {
	id?: ILayer['id']
	name?: ILayer['name']
	description?: ILayer['description']

	// layer always has access to the background color
	// if drawing image to get pixel data
	// this allows the background to be redrawn
	background: string

	// create this design type
	container: ILayerGeneratorContainer

	assets: IAssetByType
}

// TODO: make container a design type
// right now all layers are the same size as artwork/canvas
export interface ILayerGeneratorContainer {
	width: number
	height: number
	top: number
	left: number
	margin: number
	canvas: {
		width: number
		height: number
	}
}

export interface IGenerationLayer {
	generator: ILayerGenerator
	assets: IAssetGenerationByType
	items: IGenerationItem[]
}

export interface IGenerationItem {
	id: string
	fillStyle: string
	lineWidth: number
	position: {
		x: number
		y: number
	}
	rotate: number
	size: number
	strokeStyle: string
	template: string
}

export interface IGeneratorWatermark {
	text: string
	color?: string
}
