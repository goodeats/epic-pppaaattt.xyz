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
}

export function getActionType<K extends keyof ApiRouteActions>(
	path: K,
): ApiRouteActions[K] {
	const action = actions[path]
	invariant(action, `Router action not found for path: ${path}`)
	return action
}
