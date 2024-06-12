import { type User } from '@prisma/client'
import { type z } from 'zod'
import { getArtwork } from '#app/models/artwork/artwork.get.server'
import { getArtworkBranch } from '#app/models/artwork-branch/artwork-branch.get.server'
import { getArtworkVersion } from '#app/models/artwork-version/artwork-version.get.server'
import { getAsset } from '#app/models/asset/asset.get.server'
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

export class ValidateArtworkParentSubmissionStrategy
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
		const { artworkId } = data
		const artwork = await getArtwork({
			where: { id: artworkId, ownerId: userId },
		})
		if (!artwork) ctx.addIssue(addNotFoundIssue('Artwork'))
	}
}

export class ValidateArtworkBranchParentSubmissionStrategy
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
		const { branchId } = data
		const artworkBranch = await getArtworkBranch({
			where: { id: branchId, ownerId: userId },
		})
		if (!artworkBranch) ctx.addIssue(addNotFoundIssue('ArtworkBranch'))
	}
}

export class ValidateArtworkVersionSubmissionStrategy
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
		const artworkVersion = await getArtworkVersion({
			where: { id, ownerId: userId },
		})
		if (!artworkVersion) ctx.addIssue(addNotFoundIssue('ArtworkVersion'))
	}
}

export class ValidateArtworkVersionParentSubmissionStrategy
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
		const { artworkVersionId } = data
		const artworkVersion = await getArtworkVersion({
			where: { id: artworkVersionId, ownerId: userId },
		})
		if (!artworkVersion) ctx.addIssue(addNotFoundIssue('ArtworkVersion'))
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

export class ValidateAssetSubmissionStrategy
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
		const asset = await getAsset({
			where: { id, ownerId: userId },
		})
		if (!asset) ctx.addIssue(addNotFoundIssue('Asset'))
	}
}
