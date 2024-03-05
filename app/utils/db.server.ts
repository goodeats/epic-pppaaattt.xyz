import { remember } from '@epic-web/remember'
import {
	type Artboard,
	PrismaClient,
	type Project,
	type Appearance,
	type Layer,
	type AppearancesOnArtboards,
} from '@prisma/client'
import chalk from 'chalk'
import { type AppearanceType } from './appearances'
import { ArtboardPrismaExtensions } from './prisma-extensions-artboard'
import {
	DesignPrismaExtensions,
	DesignPrismaQueryExtensions,
} from './prisma-extensions-design'
import { FillPrismaExtensions } from './prisma-extensions-fill'
import { PalettePrismaExtensions } from './prisma-extensions-palette'
import { SizePrismaExtensions } from './prisma-extensions-size'
import { StrokePrismaExtensions } from './prisma-extensions-stroke'

export const prismaExtended = remember('prisma', () => {
	return new PrismaClient({})
		.$extends(ArtboardPrismaExtensions)
		.$extends(DesignPrismaQueryExtensions)
		.$extends(DesignPrismaExtensions)
		.$extends(PalettePrismaExtensions)
		.$extends(SizePrismaExtensions)
		.$extends(FillPrismaExtensions)
		.$extends(StrokePrismaExtensions)
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

export interface IAppearance extends Appearance {
	type: AppearanceType
	artboards?: IArtboard[]
	layers?: Layer[]
}

export interface IAppearancesOnArtboard extends AppearancesOnArtboards {
	appearance?: IAppearance
	artboard?: IArtboard
}
