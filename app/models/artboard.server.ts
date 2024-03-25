import { type Artboard } from '@prisma/client'
import {
	type findArtboardArgsType,
	type selectArgsType,
	type whereArgsType,
} from '#app/schema/artboard'
import { prisma } from '#app/utils/db.server'

export interface IArtboard extends Artboard {}

// use prisma extension to .save() or .delete()

export const findFirstArtboard = async ({
	where,
	select,
}: findArtboardArgsType): Promise<Artboard | null> => {
	return await prisma.artboard.findFirst({
		where,
		select,
	})
}

export const findArtboardByIdAndOwner = async ({
	id,
	ownerId,
	select,
}: {
	id: whereArgsType['id']
	ownerId: whereArgsType['ownerId']
	select?: selectArgsType
}): Promise<Artboard | null> => {
	const where = { id, ownerId }
	return await findFirstArtboard({ where, select })
}
