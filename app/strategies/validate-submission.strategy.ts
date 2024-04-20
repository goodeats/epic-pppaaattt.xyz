import { type User } from '@prisma/client'
import { type z } from 'zod'
import { getArtboardVersion } from '#app/models/artboard-version/artboard-version.get.server'
import { addNotFoundIssue } from '#app/utils/conform-utils'

export interface IValidateSubmissionStrategy {
	validateFormDataEntity(args: {
		userId: User['id']
		data: any
		ctx: z.RefinementCtx
	}): Promise<void>
}

export class ValidateArtboardVersionSubmissionStrategy
	implements IValidateSubmissionStrategy
{
	async validateFormDataEntity({
		userId,
		data,
		ctx,
	}: {
		userId: User['id']
		data: any
		ctx: any
	}): Promise<void> {
		const { id } = data
		const artboardVersion = await getArtboardVersion({
			where: { id, ownerId: userId },
		})
		if (!artboardVersion) ctx.addIssue(addNotFoundIssue('Artboard'))
	}
}

export class ValidateArtboardVersionParentSubmissionStrategy
	implements IValidateSubmissionStrategy
{
	async validateFormDataEntity({
		userId,
		data,
		ctx,
	}: {
		userId: User['id']
		data: any
		ctx: any
	}): Promise<void> {
		const { artboardVersionId } = data
		const artboardVersion = await getArtboardVersion({
			where: { id: artboardVersionId, ownerId: userId },
		})
		if (!artboardVersion) ctx.addIssue(addNotFoundIssue('Artboard'))
	}
}
