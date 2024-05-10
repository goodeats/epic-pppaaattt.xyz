import { type IArtboard } from '#app/models/artboard/artboard.server'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import { type IFill } from '#app/models/fill.server'
import { type ILayer } from '#app/models/layer.server'
import { type ILayout } from '#app/models/layout.server'
import { type ILine } from '#app/models/line.server'
import { type IPalette } from '#app/models/palette.server'
import { type IRotate } from '#app/models/rotate.server'
import { type ISize } from '#app/models/size.server'
import { type IStroke } from '#app/models/stroke.server'
import { type ITemplate } from '#app/models/template.server'

// object sent to the client
// generator has final building blocks for the generation(s)
export interface IArtboardGenerator {
	id: IArtboard['id']
	layers: ILayerGenerator[]
	success: boolean
	message: string
}
export interface IArtboardVersionGenerator {
	id: IArtboardVersion['id']
	settings: {
		width: number
		height: number
		background: string
	}
	layers: ILayerGenerator[]
	success: boolean
	message: string
}

// layer can override or default to artboard version design types
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

	// create this design type
	container: ILayerGeneratorContainer
}

// TODO: make container a design type
// right now all layers are the same size as artboard/canvas
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
