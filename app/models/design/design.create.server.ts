import { type User } from '@prisma/client'
import { type designTypeEnum } from '#app/schema/design'
import { NewArtboardVersionDesignSchema } from '#app/schema/design-artboard-version'
import { prisma } from '#app/utils/db.server'
import { type IArtboardVersion } from '../artboard-version/artboard-version.server'
import { type IArtboard } from '../artboard/artboard.server'
import { type IDesign } from '../design.server'
import { type ILayer } from '../layer.server'

export interface IDesignCreatedResponse {
	success: boolean
	message?: string
	createdDesign?: IDesign
}

export const createDesign = async ({
	data,
}: {
	data: {
		ownerId: User['id']
		type: designTypeEnum
		artboardId?: IArtboard['id']
		artboardVersionId?: IArtboardVersion['id']
		layerId?: ILayer['id']
		visible?: boolean
		selected?: boolean
	}
}): Promise<IDesign | null> => {
	const createdDesign = await prisma.design.create({ data })
	return createdDesign
}

export const createArtboardVersionDesign = async ({
	data,
}: {
	data: {
		ownerId: User['id']
		type: designTypeEnum
		artboardVersionId: IArtboardVersion['id']
		visible?: boolean
		selected?: boolean
	}
}): Promise<IDesign | null> => {
	const { ownerId } = data
	const parsedData = NewArtboardVersionDesignSchema.parse(data)
	const createdDesign = await createDesign({ data: { ownerId, ...parsedData } })
	return createdDesign
}
