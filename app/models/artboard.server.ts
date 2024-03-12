import { type Design, type Artboard } from '@prisma/client'
import {
	ArtboardSelectedDesignsSchema,
	type ArtboardSelectedDesignsType,
	type findArtboardArgsType,
	type selectArgsType,
	type whereArgsType,
} from '#app/schema/artboard'
import { type designTypeEnum } from '#app/schema/design'
import { type PrismaTransactionType, prisma } from '#app/utils/db.server'

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

export const findArtboardTransactionPromise = ({
	id,
	prisma,
}: {
	id: string
	prisma: PrismaTransactionType
}) => {
	return prisma.artboard.findFirst({
		where: { id },
	})
}

// only use in transactions
export const updateArtboardSelectedDesignPromise = ({
	artboard,
	designId,
	type,
	prisma,
}: {
	artboard: Pick<Artboard, 'id' | 'selectedDesigns'>
	designId: Design['id']
	type: designTypeEnum
	prisma: PrismaTransactionType
}) => {
	// parse the selectedDesigns of the artboard
	const selectedDesigns = ArtboardSelectedDesignsSchema.parse(
		JSON.parse(artboard.selectedDesigns),
	) as ArtboardSelectedDesignsType

	// set the key for the selectedDesigns object to update
	const designKey = (type + 'Id') as keyof ArtboardSelectedDesignsType

	// build the updated selectedDesigns object
	const updatedSelectedDesigns = ArtboardSelectedDesignsSchema.parse({
		...selectedDesigns,
		[designKey]: designId,
	})

	// update the selectedDesigns for the artboard
	return prisma.artboard.update({
		where: { id: artboard.id },
		data: { selectedDesigns: JSON.stringify(updatedSelectedDesigns) },
	})
}
