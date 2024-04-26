import { type User } from '@prisma/client'
import { type z } from 'zod'
import { getArtboardVersion } from '#app/models/artboard-version/artboard-version.get.server'
import { getDesign } from '#app/models/design/design.get.server'
import { getLayer } from '#app/models/layer/layer.get.server'
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
		if (!artboardVersion) ctx.addIssue(addNotFoundIssue('ArtboardVersion'))
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
		if (!artboardVersion) ctx.addIssue(addNotFoundIssue('ArtboardVersion'))
	}
}

export class ValidateDesignParentSubmissionStrategy
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
		const { designId } = data
		const design = await getDesign({
			where: { id: designId, ownerId: userId },
		})
		if (!design) ctx.addIssue(addNotFoundIssue('Design'))
	}
}

export class ValidateLayerSubmissionStrategy
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
		const layer = await getLayer({
			where: { id, ownerId: userId },
		})
		if (!layer) ctx.addIssue(addNotFoundIssue('Layer'))
	}
}

export class ValidateLayerParentSubmissionStrategy
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
		const { layerId } = data
		const layer = await getLayer({
			where: { id: layerId, ownerId: userId },
		})
		if (!layer) ctx.addIssue(addNotFoundIssue('Layer'))
	}
}
