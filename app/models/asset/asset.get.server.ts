import { z } from 'zod'
import { prisma } from '#app/utils/db.server'
import { type IAsset } from './asset.server'

export type queryAssetWhereArgsType = z.infer<typeof whereArgs>
const whereArgs = z.object({
	id: z.string().optional(),
	ownerId: z.string().optional(),
})

// TODO: Add schemas for each type of query and parse with zod
// aka if by id that should be present, if by slug that should be present
// owner id should be present unless admin (not set up yet)
const validateQueryWhereArgsPresent = (where: queryAssetWhereArgsType) => {
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
			'Null or undefined values are not allowed in query parameters for asset.',
		)
	}
}

export const getAsset = async ({
	where,
}: {
	where: queryAssetWhereArgsType
}): Promise<IAsset | null> => {
	validateQueryWhereArgsPresent(where)
	return await prisma.asset.findFirst({
		where,
	})
}
