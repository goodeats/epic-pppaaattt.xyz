import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, type MetaFunction } from '@remix-run/react'
import { formatDistanceToNow } from 'date-fns'
import {
	PanelContainer,
	SketchBody,
	SketchBodyContent,
} from '#app/components/shared'
import { requireUserId } from '#app/utils/auth.server'
import { CanvasContent } from './components/canvas-content'
import { PanelContent } from './components/panel-content'
import { getArtboard, getOwner } from './queries'

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const owner = await getOwner(userId)
	invariantResponse(owner, 'Owner not found', { status: 404 })

	const { slug } = params
	const artboard = await getArtboard(userId, slug as string)
	invariantResponse(artboard, 'Artboard not found', { status: 404 })

	const date = new Date(artboard.updatedAt)
	const artboardTimeAgo = formatDistanceToNow(date)

	return json({ owner, artboard, artboardTimeAgo })
}

export default function SketchRoute() {
	const data = useLoaderData<typeof loader>()
	return (
		<SketchBody>
			<SketchBodyContent>
				<CanvasContent artboard={data.artboard} />
			</SketchBodyContent>
			<PanelContainer>
				<PanelContent artboard={data.artboard} />
			</PanelContainer>
		</SketchBody>
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
