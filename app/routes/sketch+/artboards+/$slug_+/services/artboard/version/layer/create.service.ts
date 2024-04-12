import { type User } from '@prisma/client'
import { type IArtboardVersion } from '#app/models/artboard-version.server'
import {
	type ILayerCreateOverrides,
	findFirstLayer,
	type ILayer,
} from '#app/models/layer.server'
import { ArtboardVersionLayerDataCreateSchema } from '#app/schema/layer-artboard-version'
import { prisma } from '#app/utils/db.server'
import {
	layerCreateService,
	type ICreateLayerStrategy,
} from '../../../layer/create.service'

export class ArtboardVersionCreateLayerStrategy
	implements ICreateLayerStrategy
{
	async getEntityLayersTail({
		targetEntityId,
	}: {
		targetEntityId: IArtboardVersion['id']
	}): Promise<ILayer | null> {
		return await findFirstLayer({
			where: { artboardVersionId: targetEntityId, nextId: null },
		})
	}

	async createEntityLayer({
		userId,
		targetEntityId,
		layerOverrides,
	}: {
		userId: User['id']
		targetEntityId: IArtboardVersion['id']
		layerOverrides: ILayerCreateOverrides
	}): Promise<ILayer> {
		const data = ArtboardVersionLayerDataCreateSchema.parse({
			ownerId: userId,
			artboardVersionId: targetEntityId,
			...layerOverrides,
		})
		return await prisma.layer.create({ data })
	}

	async getEntityLayersCount({
		targetEntityId,
	}: {
		targetEntityId: IArtboardVersion['id']
	}): Promise<number> {
		return await prisma.layer.count({
			where: { artboardVersionId: targetEntityId },
		})
	}
}

export const artboardVersionLayerCreateService = async ({
	userId,
	artboardVersionId,
	layerOverrides = {},
}: {
	userId: User['id']
	artboardVersionId: IArtboardVersion['id']
	layerOverrides?: ILayerCreateOverrides
}) => {
	try {
		const strategy = new ArtboardVersionCreateLayerStrategy()
		await layerCreateService({
			userId,
			targetEntityId: artboardVersionId,
			layerOverrides,
			strategy,
		})

		return { success: true }
	} catch (error) {
		console.log('artboardLayerCreateService error', error)
		return { error: true }
	}
}
