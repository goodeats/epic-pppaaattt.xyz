import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs } from '@remix-run/node'
import { getAssetImageArtworkVersionSrc } from '#app/models/asset/image/image.get.artwork-version.server'
import { requireUserId } from '#app/utils/auth.server'

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	invariantResponse(params.artworkVersionId, 'Artwork Version ID is required', {
		status: 400,
	})
	invariantResponse(params.imageId, 'Image ID is required', { status: 400 })
	const image = await getAssetImageArtworkVersionSrc({
		id: params.imageId,
		artworkVersionId: params.artworkVersionId,
		ownerId: userId,
	})

	invariantResponse(image, 'Not found', { status: 404 })

	return new Response(image.blob, {
		headers: {
			'Content-Type': image.contentType,
			'Content-Length': Buffer.byteLength(image.blob).toString(),
			'Content-Disposition': `inline; filename="${params.imageId}"`,
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	})
}
