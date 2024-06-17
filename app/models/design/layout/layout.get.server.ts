import { invariant } from '@epic-web/invariant'
import { z } from 'zod'
import { DesignTypeEnum } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'
import { deserializeDesign } from '../utils'
import { type IDesignLayout } from './layout.server'

export type queryWhereArgsType = z.infer<typeof whereArgs>
const whereArgs = z.object({
	id: z.string().optional(),
	ownerId: z.string().optional(),
	artworkVersionId: z.string().optional(),
	layerId: z.string().optional(),
})

// TODO: Add schemas for each type of query and parse with zod
// aka if by id that should be present, if by slug that should be present
// owner id should be present unless admin (not set up yet)
const validateQueryWhereArgsPresent = (where: queryWhereArgsType) => {
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
			'Null or undefined values are not allowed in query parameters for design layout.',
		)
	}
}

export const getDesignLayout = async ({
	where,
}: {
	where: queryWhereArgsType
}): Promise<IDesignLayout | null> => {
	validateQueryWhereArgsPresent(where)
	const design = await prisma.design.findFirst({
		where: {
			...where,
			type: DesignTypeEnum.LAYOUT,
		},
	})
	invariant(design, 'Design Layout Not found')
	return deserializeDesign({ design }) as IDesignLayout
}
