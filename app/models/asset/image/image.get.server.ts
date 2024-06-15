import { invariant } from '@epic-web/invariant'
import { z } from 'zod'
import { AssetTypeEnum } from '#app/schema/asset'
import { deserializeAsset } from '#app/utils/asset'
import { prisma } from '#app/utils/db.server'
import { type IAssetImage } from './image.server'

export type queryAssetImageWhereArgsType = z.infer<typeof whereArgs>
const whereArgs = z.object({
	id: z.string().optional(),
	ownerId: z.string().optional(),
	artworkId: z.string().optional(),
	artworkVersionId: z.string().optional(),
	layerId: z.string().optional(),
})

// TODO: Add schemas for each type of query and parse with zod
// aka if by id that should be present, if by slug that should be present
// owner id should be present unless admin (not set up yet)
const validateQueryWhereArgsPresent = (where: queryAssetImageWhereArgsType) => {
	const nullValuesAllowed: string[] = []
	const missingValues: Record<string, any> = {}
	for (const [key, value] of Object.entries(where)) {
		const valueIsNull = value === null || value === undefined
		const nullValueAllowed = nullValuesAllowed.includes(key)
		if (valueIsNull && !nullValueAllowed) {
			missingValues[key] = value
		}
	}

	if (Object.keys(missingValues).length > 0) {
		console.log('Missing values:', missingValues)
		throw new Error(
			'Null or undefined values are not allowed in query parameters for asset image.',
		)
	}
}

export const getAssetImage = async ({
	where,
}: {
	where: queryAssetImageWhereArgsType
}): Promise<IAssetImage | null> => {
	validateQueryWhereArgsPresent(where)
	const asset = await prisma.asset.findFirst({
		where: {
			...where,
			type: AssetTypeEnum.IMAGE,
		},
	})
	invariant(asset, 'Asset Image Not found')
	return deserializeAsset({ asset }) as IAssetImage
}
