import { invariant } from '@epic-web/invariant'
import {
	type IAssetImageLayerCreateSubmission,
	createAssetImageLayer,
} from '#app/models/asset/image/image.create.layer.server'
import { type IAssetImageCreatedResponse } from '#app/models/asset/image/image.create.server'
import { getLayer } from '#app/models/layer/layer.get.server'
import { AssetTypeEnum } from '#app/schema/asset'
import { AssetImageLayerDataSchema } from '#app/schema/asset/image.layer'
import { prisma } from '#app/utils/db.server'

export const assetImageLayerCreateService = async ({
	userId,
	layerId,
	name,
	description,
	blob,
	altText,
	contentType,
	height,
	width,
	size,
	lastModified,
	filename,
}: IAssetImageLayerCreateSubmission): Promise<IAssetImageCreatedResponse> => {
	try {
		// Step 1: verify the layer exists
		const layer = await getLayer({
			where: { id: layerId, ownerId: userId },
		})
		invariant(layer, 'Layer not found')

		// Step 2: validate asset image data
		// zod schema for blob Buffer/File is not working
		// pass in separately from validation
		const data = {
			name,
			description,
			type: AssetTypeEnum.IMAGE,
			attributes: {
				altText: altText || 'No alt text provided.',
				contentType,
				height,
				width,
				size,
				lastModified,
				filename,
			},
			visible: true,
			ownerId: userId,
			layerId,
		}
		const assetImageData = AssetImageLayerDataSchema.parse(data)

		// Step 3: create the asset image via promise
		const createAssetImagePromise = createAssetImageLayer({
			data: { ...assetImageData, blob },
		})

		// Step 4: execute the transaction
		const [createdAssetImage] = await prisma.$transaction([
			createAssetImagePromise,
		])

		return {
			createdAssetImage,
			success: true,
		}
	} catch (error) {
		console.log(error)
		return {
			success: false,
			message: 'Unknown error: assetImageLayerCreateService',
		}
	}
}
