import { invariantResponse } from '@epic-web/invariant'
import { json, redirect, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, type UIMatch } from '@remix-run/react'
import { findAppearanceTypeBySlug } from '#app/utils/appearances'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server'
import { transformSlugToTitle } from '#app/utils/string-formatting'

export async function loader({ params, request }: LoaderFunctionArgs) {
	await requireUserId(request)

	const { type, username } = params
	if (!type || !findAppearanceTypeBySlug(type)) {
		return redirect(`/users/${username}/appearances/`)
	}

	const owner = await prisma.user.findFirst({
		select: {
			id: true,
			name: true,
			username: true,
			image: { select: { id: true } },
			appearances: {
				select: { slug: true, name: true },
				where: { type },
			},
		},
		where: { username: params.username },
	})

	invariantResponse(owner, 'Owner not found', { status: 404 })

	const breadcrumb = transformSlugToTitle(type) || 'Appearance'

	return json({ breadcrumb, owner })
}

export const handle = {
	breadcrumb: (match: UIMatch) => {
		const { params } = match
		// I don't like using the slug as a breadcrumb, but I am not able to get the name from a loader just yet
		// https://github.com/triggerdotdev/trigger.dev/blob/main/apps/webapp/app/routes/_app.orgs.%24organizationSlug/route.tsx#L65
		// set "some" breadcrumb and set `breadcrumb` string from loader
		// if wanting to set the name more explicitly
		return params.type || 'Appearance'
	},
}

export default function AppearanceRoute() {
	return <Outlet />
}
