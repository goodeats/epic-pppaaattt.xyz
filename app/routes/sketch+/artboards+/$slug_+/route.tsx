import { invariantResponse } from '@epic-web/invariant'
import {
	type DataFunctionArgs,
	json,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useLoaderData, type MetaFunction } from '@remix-run/react'
import { formatDistanceToNow } from 'date-fns'
import {
	PanelContainer,
	SketchBody,
	SketchBodyContent,
} from '#app/components/shared'
import { findManyDesignsWithType } from '#app/models/design.server'
import { requireUserId } from '#app/utils/auth.server'
import { validateCSRF } from '#app/utils/csrf.server'
import {
	artboardDesignDeleteAction,
	artboardDesignReorderAction,
	artboardDesignToggleVisibilityAction,
} from './actions/artboard-design'
import {
	artboardDesignEditFillAction,
	artboardDesignNewFillAction,
} from './actions/artboard-design-fill'
import {
	artboardDesignEditPaletteAction,
	artboardDesignNewPaletteAction,
} from './actions/artboard-design-palette'
import {
	artboardDesignEditSizeAction,
	artboardDesignNewSizeAction,
} from './actions/artboard-design-size'
import {
	artboardUpdateBackgroundColorAction,
	artboardUpdateHeightAction,
	artboardUpdateWidthAction,
} from './actions/update-artboard'
import { CanvasContent } from './components/canvas-content'
import { PanelContent } from './components/panel-content'
import { INTENT } from './intent'
import { getArtboard, getOwner } from './queries'

export async function action({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	await validateCSRF(formData, request.headers)

	const actionArgs = { request, userId, formData }
	const intent = formData.get('intent')
	switch (intent) {
		case INTENT.artboardUpdateWidth: {
			return artboardUpdateWidthAction(actionArgs)
		}
		case INTENT.artboardUpdateHeight: {
			return artboardUpdateHeightAction(actionArgs)
		}
		case INTENT.artboardUpdateBackgroundColor: {
			return artboardUpdateBackgroundColorAction(actionArgs)
		}
		case INTENT.artboardReorderDesign: {
			return artboardDesignReorderAction(actionArgs)
		}
		case INTENT.artboardToggleVisibilityDesign: {
			return artboardDesignToggleVisibilityAction(actionArgs)
		}
		case INTENT.artboardDeleteDesign: {
			return artboardDesignDeleteAction(actionArgs)
		}
		case INTENT.artboardCreateDesignPalette: {
			return artboardDesignNewPaletteAction(actionArgs)
		}
		case INTENT.artboardUpdateDesignPalette: {
			return artboardDesignEditPaletteAction(actionArgs)
		}
		case INTENT.artboardCreateDesignSize: {
			return artboardDesignNewSizeAction(actionArgs)
		}
		case INTENT.artboardUpdateDesignSize: {
			return artboardDesignEditSizeAction(actionArgs)
		}
		case INTENT.artboardCreateDesignFill: {
			return artboardDesignNewFillAction(actionArgs)
		}
		case INTENT.artboardUpdateDesignFill: {
			return artboardDesignEditFillAction(actionArgs)
		}
		default: {
			throw new Response(`Invalid intent "${intent}"`, { status: 400 })
		}
	}
}

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const owner = await getOwner(userId)
	invariantResponse(owner, 'Owner not found', { status: 404 })

	const { slug } = params
	const artboard = await getArtboard(userId, slug as string)
	invariantResponse(artboard, 'Artboard not found', { status: 404 })

	const date = new Date(artboard.updatedAt)
	const artboardTimeAgo = formatDistanceToNow(date)

	const artboardDesigns = await findManyDesignsWithType({
		where: { artboardId: artboard.id },
	})

	return json({ owner, artboard, artboardTimeAgo, artboardDesigns })
}

export default function SketchRoute() {
	const data = useLoaderData<typeof loader>()
	return (
		<SketchBody>
			<SketchBodyContent>
				<CanvasContent artboard={data.artboard} />
			</SketchBodyContent>
			<PanelContainer>
				<PanelContent
					artboard={data.artboard}
					artboardDesigns={data.artboardDesigns}
				/>
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
