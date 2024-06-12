import { invariant } from '@epic-web/invariant'
import { z } from 'zod'
import { AssetTypeEnum } from '#app/schema/asset'
import { deserializeAsset } from '#app/utils/asset'
import { parseAssetImageAttributes } from '#app/utils/asset/image'
import { prisma } from '#app/utils/db.server'
import { type IAssetImageSrc, type IAssetImage } from './image.server'

export type queryAssetImageWhereArgsType = z.infer<typeof whereArgs>
const whereArgs = z.object({
	id: z.string().optional(),
	ownerId: z.string().optional(),
	artworkId: z.string().optional(),
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

// just return the minimum required data
// for loading the image from the route url
export const getAssetImageArtworkSrc = async ({
	id,
	artworkId,
	ownerId,
}: {
	id: IAssetImage['id']
	artworkId: IAssetImage['artworkId']
	ownerId: IAssetImage['ownerId']
}): Promise<IAssetImageSrc | null> => {
	const image = await prisma.asset.findUnique({
		where: {
			id,
			ownerId,
			artworkId,
			type: AssetTypeEnum.IMAGE,
		},
		select: {
			attributes: true,
			blob: true,
		},
	})
	invariant(image, 'Asset Image Not found: ' + id)
	invariant(image.blob, 'Asset Image has no blob: ' + id)

	const attributes = parseAssetImageAttributes(image.attributes)

	return {
		contentType: attributes.contentType,
		blob: image.blob,
	}
}
