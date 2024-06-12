import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs } from '@remix-run/node'
import { getAssetImageArtworkSrc } from '#app/models/asset/image/image.get.server'
import { requireUserId } from '#app/utils/auth.server'

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	invariantResponse(params.artworkId, 'Artwork ID is required', { status: 400 })
	invariantResponse(params.imageId, 'Image ID is required', { status: 400 })
	const image = await getAssetImageArtworkSrc({
		id: params.imageId,
		artworkId: params.artworkId,
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
