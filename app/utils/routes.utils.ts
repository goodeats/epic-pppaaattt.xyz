import { invariant } from '@epic-web/invariant'
import {
	loader as apiV1ArtboardVersionDesignCreateLoader,
	action as apiV1ArtboardVersionDesignCreateAction,
} from '#app/routes/resources+/api.v1+/artboard-version.design.create'
import {
	loader as apiV1ArtboardVersionDesignDeleteLoader,
	action as apiV1ArtboardVersionDesignDeleteAction,
} from '#app/routes/resources+/api.v1+/artboard-version.design.delete'
import {
	loader as apiV1ArtboardVersionDesignUpdateOrderLoader,
	action as apiV1ArtboardVersionDesignUpdateOrderAction,
} from '#app/routes/resources+/api.v1+/artboard-version.design.update.order'
import {
	loader as apiV1ArtboardVersionDesignUpdateVisibleLoader,
	action as apiV1ArtboardVersionDesignUpdateVisibleAction,
} from '#app/routes/resources+/api.v1+/artboard-version.design.update.visible'
import {
	loader as apiV1ArtboardVersionUpdateBackgroundLoader,
	action as apiV1ArtboardVersionUpdateBackgroundAction,
} from '#app/routes/resources+/api.v1+/artboard-version.update.background'
import {
	loader as apiV1ArtboardVersionUpdateHeightLoader,
	action as apiV1ArtboardVersionUpdateHeightAction,
} from '#app/routes/resources+/api.v1+/artboard-version.update.height'
import {
	loader as apiV1ArtboardVersionUpdateWidthLoader,
	action as apiV1ArtboardVersionUpdateWidthAction,
} from '#app/routes/resources+/api.v1+/artboard-version.update.width'
import {
	loader as apiV1DesignTypeLayoutColumnsLoader,
	action as apiV1DesignTypeLayoutColumnsAction,
} from '#app/routes/resources+/api.v1+/design.type.layout.update.columns'
import {
	loader as apiV1DesignTypeLayoutCountLoader,
	action as apiV1DesignTypeLayoutCountAction,
} from '#app/routes/resources+/api.v1+/design.type.layout.update.count'
import {
	loader as apiV1DesignTypeLayoutRowsLoader,
	action as apiV1DesignTypeLayoutRowsAction,
} from '#app/routes/resources+/api.v1+/design.type.layout.update.rows'
import {
	loader as apiV1DesignTypeLayoutStyleLoader,
	action as apiV1DesignTypeLayoutStyleAction,
} from '#app/routes/resources+/api.v1+/design.type.layout.update.style'
import { type ExtractStringValues } from './typescript-helpers'

export type RoutePath = ExtractStringValues<typeof Routes>
const pathBase = '/resources/api/v1'

export const Routes = {
	RESOURCES: {
		API: {
			V1: {
				ARTBOARD_VERSION: {
					UPDATE: {
						BACKGROUND: `${pathBase}/artboard-version/update/background`,
						WIDTH: `${pathBase}/artboard-version/update/width`,
						HEIGHT: `${pathBase}/artboard-version/update/height`,
					},
					DESIGN: {
						CREATE: `${pathBase}/artboard-version/design/create`,
						DELETE: `${pathBase}/artboard-version/design/delete`,
						UPDATE: {
							VISIBLE: `${pathBase}/artboard-version/design/update/visible`,
							ORDER: `${pathBase}/artboard-version/design/update/order`,
						},
					},
				},
				DESIGN: {
					TYPE: {
						LAYOUT: {
							UPDATE: {
								COUNT: `${pathBase}/design/type/layout/update/count`,
								ROWS: `${pathBase}/design/type/layout/update/rows`,
								COLUMNS: `${pathBase}/design/type/layout/update/columns`,
								STYLE: `${pathBase}/design/type/layout/update/style`,
							},
						},
					},
				},
			},
		},
	},
} as const

export interface ApiRouteLoaders {
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.UPDATE
		.BACKGROUND]: typeof apiV1ArtboardVersionUpdateBackgroundLoader
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.UPDATE
		.WIDTH]: typeof apiV1ArtboardVersionUpdateWidthLoader
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.UPDATE
		.HEIGHT]: typeof apiV1ArtboardVersionUpdateHeightLoader
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN
		.CREATE]: typeof apiV1ArtboardVersionDesignCreateLoader
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN
		.DELETE]: typeof apiV1ArtboardVersionDesignDeleteLoader
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN.UPDATE
		.VISIBLE]: typeof apiV1ArtboardVersionDesignUpdateVisibleLoader
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN.UPDATE
		.ORDER]: typeof apiV1ArtboardVersionDesignUpdateOrderLoader
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE
		.COUNT]: typeof apiV1DesignTypeLayoutCountLoader
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE
		.ROWS]: typeof apiV1DesignTypeLayoutRowsLoader
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE
		.COLUMNS]: typeof apiV1DesignTypeLayoutColumnsLoader
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE
		.STYLE]: typeof apiV1DesignTypeLayoutStyleLoader
}

export const loaders: ApiRouteLoaders = {
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.UPDATE.BACKGROUND]:
		apiV1ArtboardVersionUpdateBackgroundLoader,
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.UPDATE.WIDTH]:
		apiV1ArtboardVersionUpdateWidthLoader,
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.UPDATE.HEIGHT]:
		apiV1ArtboardVersionUpdateHeightLoader,
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN.CREATE]:
		apiV1ArtboardVersionDesignCreateLoader,
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN.DELETE]:
		apiV1ArtboardVersionDesignDeleteLoader,
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN.UPDATE.VISIBLE]:
		apiV1ArtboardVersionDesignUpdateVisibleLoader,
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN.UPDATE.ORDER]:
		apiV1ArtboardVersionDesignUpdateOrderLoader,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE.COUNT]:
		apiV1DesignTypeLayoutCountLoader,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE.ROWS]:
		apiV1DesignTypeLayoutRowsLoader,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE.COLUMNS]:
		apiV1DesignTypeLayoutColumnsLoader,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE.STYLE]:
		apiV1DesignTypeLayoutStyleLoader,
}

export function getLoaderType<K extends keyof ApiRouteLoaders>(
	path: K,
): ApiRouteLoaders[K] {
	const loader = loaders[path]
	invariant(loader, `Router loader not found for path: ${path}`)
	return loader
}

export interface ApiRouteActions {
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.UPDATE
		.BACKGROUND]: typeof apiV1ArtboardVersionUpdateBackgroundAction
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.UPDATE
		.WIDTH]: typeof apiV1ArtboardVersionUpdateWidthAction
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.UPDATE
		.HEIGHT]: typeof apiV1ArtboardVersionUpdateHeightAction
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN
		.CREATE]: typeof apiV1ArtboardVersionDesignCreateAction
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN
		.DELETE]: typeof apiV1ArtboardVersionDesignDeleteAction
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN.UPDATE
		.VISIBLE]: typeof apiV1ArtboardVersionDesignUpdateVisibleAction
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN.UPDATE
		.ORDER]: typeof apiV1ArtboardVersionDesignUpdateOrderAction
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE
		.COUNT]: typeof apiV1DesignTypeLayoutCountAction
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE
		.ROWS]: typeof apiV1DesignTypeLayoutRowsAction
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE
		.COLUMNS]: typeof apiV1DesignTypeLayoutColumnsAction
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE
		.STYLE]: typeof apiV1DesignTypeLayoutStyleAction
}

export const actions: ApiRouteActions = {
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.UPDATE.BACKGROUND]:
		apiV1ArtboardVersionUpdateBackgroundAction,
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.UPDATE.WIDTH]:
		apiV1ArtboardVersionUpdateWidthAction,
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.UPDATE.HEIGHT]:
		apiV1ArtboardVersionUpdateHeightAction,
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN.CREATE]:
		apiV1ArtboardVersionDesignCreateAction,
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN.DELETE]:
		apiV1ArtboardVersionDesignDeleteAction,
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN.UPDATE.VISIBLE]:
		apiV1ArtboardVersionDesignUpdateVisibleAction,
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN.UPDATE.ORDER]:
		apiV1ArtboardVersionDesignUpdateOrderAction,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE.COUNT]:
		apiV1DesignTypeLayoutCountAction,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE.ROWS]:
		apiV1DesignTypeLayoutRowsAction,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE.COLUMNS]:
		apiV1DesignTypeLayoutColumnsAction,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE.STYLE]:
		apiV1DesignTypeLayoutStyleAction,
}

export function getActionType<K extends keyof ApiRouteActions>(
	path: K,
): ApiRouteActions[K] {
	const action = actions[path]
	invariant(action, `Router action not found for path: ${path}`)
	return action
}
