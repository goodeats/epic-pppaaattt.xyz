import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, type UIMatch } from '@remix-run/react'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server'

export async function loader({ params, request }: LoaderFunctionArgs) {
	await requireUserId(request)
	const userId = await requireUserId(request)
	const artwork = await prisma.artwork.findFirst({
		where: { slug: params.artworkId, ownerId: userId },
		select: {
			name: true,
		},
	})

	invariantResponse(artwork, 'Not found', { status: 404 })

	return json({ breadcrumb: artwork.name })
}

export const handle = {
	breadcrumb: (match: UIMatch) => {
		const { params } = match
		// I don't like using the slug as a breadcrumb, but I am not able to get the name from a loader just yet
		// https://github.com/triggerdotdev/trigger.dev/blob/main/apps/webapp/app/routes/_app.orgs.%24organizationSlug/route.tsx#L65
		// set "some" breadcrumb and set `breadcrumb` string from loader
		// if wanting to set the name more explicitly
		return params.artworkId || 'Artwork'
	},
}

export default function ArtworkRoute() {
	return <Outlet />
}
