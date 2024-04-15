import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { type MetaFunction } from '@remix-run/react'
import { DashboardBody } from '#app/components/layout/dashboard.tsx'
import { requireUserId } from '#app/utils/auth.server'
import { getArtboard, getOwner } from '../../queries'

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const owner = await getOwner(userId)
	invariantResponse(owner, 'Owner not found', { status: 404 })

	const { slug } = params
	const artboard = await getArtboard(userId, slug as string)
	invariantResponse(artboard, 'Artboard not found', { status: 404 })

	return json({
		owner,
		artboard,
	})
}

export default function SketchRoute() {
	return (
		<DashboardBody id="sketch-dashboard-body">
			<p>version</p>
		</DashboardBody>
	)
}

export const meta: MetaFunction<
	null,
	{ 'routes/sketch+/artboards+/$slug_+/route': typeof loader }
> = ({ matches }) => {
	const routeMatch = matches.find(
		m => m.id === 'routes/sketch+/artboards+/$slug_+/route',
	)
	const descriptionEntity = 'Sketch'
	const entityTitle = routeMatch?.data?.artboard.name ?? 'Artboard'

	return [
		{ title: `${entityTitle} | Sketch` },
		{
			name: 'description',
			content: `Checkout ${descriptionEntity} on PPPAAATTT.XYZ`,
		},
	]
}
