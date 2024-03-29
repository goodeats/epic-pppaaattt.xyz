import { remember } from '@epic-web/remember'
import {
	type Artboard,
	PrismaClient,
	type Project,
	type Prisma,
} from '@prisma/client'
import { type DefaultArgs } from '@prisma/client/runtime/library'
import chalk from 'chalk'
import { ArtboardPrismaExtensions } from './prisma-extensions-artboard'
import {
	DesignPrismaExtensions,
	DesignPrismaQueryExtensions,
} from './prisma-extensions-design'
import { FillPrismaExtensions } from './prisma-extensions-fill'
import { LayerPrismaExtensions } from './prisma-extensions-layer'
import { LayoutPrismaExtensions } from './prisma-extensions-layout'
import { LinePrismaExtensions } from './prisma-extensions-line'
import { PalettePrismaExtensions } from './prisma-extensions-palette'
import { RotatePrismaExtensions } from './prisma-extensions-rotate'
import { SizePrismaExtensions } from './prisma-extensions-size'
import { StrokePrismaExtensions } from './prisma-extensions-stroke'
import { TemplatePrismaExtensions } from './prisma-extensions-template'

// for use in transactions and you want to call prisma from functions outside the transaction
export type PrismaTransactionType = Omit<
	PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
	'$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

export const prismaExtended = remember('prisma', () => {
	return new PrismaClient({})
		.$extends(ArtboardPrismaExtensions)
		.$extends(DesignPrismaQueryExtensions)
		.$extends(DesignPrismaExtensions)
		.$extends(PalettePrismaExtensions)
		.$extends(SizePrismaExtensions)
		.$extends(FillPrismaExtensions)
		.$extends(StrokePrismaExtensions)
		.$extends(LinePrismaExtensions)
		.$extends(RotatePrismaExtensions)
		.$extends(LayoutPrismaExtensions)
		.$extends(TemplatePrismaExtensions)
		.$extends(LayerPrismaExtensions)
})

export const prisma = remember('prisma', () => {
	// NOTE: if you change anything in this function you'll need to restart
	// the dev server to see your changes.

	// Feel free to change this log threshold to something that makes sense for you
	const logThreshold = 20

	const client = new PrismaClient({
		log: [
			{ level: 'query', emit: 'event' },
			{ level: 'error', emit: 'stdout' },
			{ level: 'warn', emit: 'stdout' },
		],
	})
	// $on prevents the ability to use prisma extensions
	client.$on('query', async e => {
		if (e.duration < logThreshold) return
		const color =
			e.duration < logThreshold * 1.1
				? 'green'
				: e.duration < logThreshold * 1.2
				  ? 'blue'
				  : e.duration < logThreshold * 1.3
				    ? 'yellow'
				    : e.duration < logThreshold * 1.4
				      ? 'redBright'
				      : 'red'
		const dur = chalk[color](`${e.duration}ms`)
		console.info(`prisma:query - ${dur} - ${e.query}`)
	})
	client.$connect()
	return client
})

export interface IProject extends Project {
	artboards?: Artboard[]
}

export interface IArtboard extends Artboard {
	project?: Project
}
