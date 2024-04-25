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
	loader as apiV1ArtboardVersionLayerCreateLoader,
	action as apiV1ArtboardVersionLayerCreateAction,
} from '#app/routes/resources+/api.v1+/artboard-version.layer.create'
import {
	loader as apiV1ArtboardVersionLayerDeleteLoader,
	action as apiV1ArtboardVersionLayerDeleteAction,
} from '#app/routes/resources+/api.v1+/artboard-version.layer.delete'
import {
	loader as apiV1ArtboardVersionLayerUpdateOrderLoader,
	action as apiV1ArtboardVersionLayerUpdateOrderAction,
} from '#app/routes/resources+/api.v1+/artboard-version.layer.update.order'
import {
	loader as apiV1ArtboardVersionLayerUpdateVisibleLoader,
	action as apiV1ArtboardVersionLayerUpdateVisibleAction,
} from '#app/routes/resources+/api.v1+/artboard-version.layer.update.visible'
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
	loader as apiV1DesignTypeFillBasisLoader,
	action as apiV1DesignTypeFillBasisAction,
} from '#app/routes/resources+/api.v1+/design.type.fill.update.basis'
import {
	loader as apiV1DesignTypeFillStyleLoader,
	action as apiV1DesignTypeFillStyleAction,
} from '#app/routes/resources+/api.v1+/design.type.fill.update.style'
import {
	loader as apiV1DesignTypeFillValueLoader,
	action as apiV1DesignTypeFillValueAction,
} from '#app/routes/resources+/api.v1+/design.type.fill.update.value'
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
import {
	loader as apiV1DesignTypeLineBasisLoader,
	action as apiV1DesignTypeLineBasisAction,
} from '#app/routes/resources+/api.v1+/design.type.line.update.basis'
import {
	loader as apiV1DesignTypeLineFormatLoader,
	action as apiV1DesignTypeLineFormatAction,
} from '#app/routes/resources+/api.v1+/design.type.line.update.format'
import {
	loader as apiV1DesignTypeLineWidthLoader,
	action as apiV1DesignTypeLineWidthAction,
} from '#app/routes/resources+/api.v1+/design.type.line.update.width'
import {
	loader as apiV1DesignTypePaletteValueLoader,
	action as apiV1DesignTypePaletteValueAction,
} from '#app/routes/resources+/api.v1+/design.type.palette.update.value'
import {
	loader as apiV1DesignTypeRotateBasisLoader,
	action as apiV1DesignTypeRotateBasisAction,
} from '#app/routes/resources+/api.v1+/design.type.rotate.update.basis'
import {
	loader as apiV1DesignTypeRotateValueLoader,
	action as apiV1DesignTypeRotateValueAction,
} from '#app/routes/resources+/api.v1+/design.type.rotate.update.value'
import {
	loader as apiV1DesignTypeSizeBasisLoader,
	action as apiV1DesignTypeSizeBasisAction,
} from '#app/routes/resources+/api.v1+/design.type.size.update.basis'
import {
	loader as apiV1DesignTypeSizeFormatLoader,
	action as apiV1DesignTypeSizeFormatAction,
} from '#app/routes/resources+/api.v1+/design.type.size.update.format'
import {
	loader as apiV1DesignTypeSizeValueLoader,
	action as apiV1DesignTypeSizeValueAction,
} from '#app/routes/resources+/api.v1+/design.type.size.update.value'
import {
	loader as apiV1DesignTypeStrokeBasisLoader,
	action as apiV1DesignTypeStrokeBasisAction,
} from '#app/routes/resources+/api.v1+/design.type.stroke.update.basis'
import {
	loader as apiV1DesignTypeStrokeStyleLoader,
	action as apiV1DesignTypeStrokeStyleAction,
} from '#app/routes/resources+/api.v1+/design.type.stroke.update.style'
import {
	loader as apiV1DesignTypeStrokeValueLoader,
	action as apiV1DesignTypeStrokeValueAction,
} from '#app/routes/resources+/api.v1+/design.type.stroke.update.value'
import {
	loader as apiV1DesignTypeTemplateStyleLoader,
	action as apiV1DesignTypeTemplateStyleAction,
} from '#app/routes/resources+/api.v1+/design.type.template.update.style'
import {
	loader as apiV1LayerUpdateDescriptionLoader,
	action as apiV1LayerUpdateDescriptionAction,
} from '#app/routes/resources+/api.v1+/layer.update.description'
import {
	loader as apiV1LayerUpdateNameLoader,
	action as apiV1LayerUpdateNameAction,
} from '#app/routes/resources+/api.v1+/layer.update.name'
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
					LAYER: {
						CREATE: `${pathBase}/artboard-version/layer/create`,
						DELETE: `${pathBase}/artboard-version/layer/delete`,
						UPDATE: {
							VISIBLE: `${pathBase}/artboard-version/layer/update/visible`,
							ORDER: `${pathBase}/artboard-version/layer/update/order`,
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
						PALETTE: {
							UPDATE: {
								VALUE: `${pathBase}/design/type/palette/update/value`,
							},
						},
						SIZE: {
							UPDATE: {
								BASIS: `${pathBase}/design/type/size/update/basis`,
								FORMAT: `${pathBase}/design/type/size/update/format`,
								VALUE: `${pathBase}/design/type/size/update/value`,
							},
						},
						FILL: {
							UPDATE: {
								BASIS: `${pathBase}/design/type/fill/update/basis`,
								VALUE: `${pathBase}/design/type/fill/update/value`,
								STYLE: `${pathBase}/design/type/fill/update/style`,
							},
						},
						STROKE: {
							UPDATE: {
								BASIS: `${pathBase}/design/type/stroke/update/basis`,
								VALUE: `${pathBase}/design/type/stroke/update/value`,
								STYLE: `${pathBase}/design/type/stroke/update/style`,
							},
						},
						LINE: {
							UPDATE: {
								BASIS: `${pathBase}/design/type/line/update/basis`,
								FORMAT: `${pathBase}/design/type/line/update/format`,
								WIDTH: `${pathBase}/design/type/line/update/width`,
							},
						},
						ROTATE: {
							UPDATE: {
								BASIS: `${pathBase}/design/type/rotate/update/basis`,
								VALUE: `${pathBase}/design/type/rotate/update/value`,
							},
						},
						TEMPLATE: {
							UPDATE: {
								STYLE: `${pathBase}/design/type/template/update/style`,
							},
						},
					},
				},
				LAYER: {
					UPDATE: {
						DESCRIPTION: `${pathBase}/layer/update/description`,
						NAME: `${pathBase}/layer/update/name`,
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
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER
		.CREATE]: typeof apiV1ArtboardVersionLayerCreateLoader
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER
		.DELETE]: typeof apiV1ArtboardVersionLayerDeleteLoader
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER.UPDATE
		.VISIBLE]: typeof apiV1ArtboardVersionLayerUpdateVisibleLoader
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER.UPDATE
		.ORDER]: typeof apiV1ArtboardVersionLayerUpdateOrderLoader
	[Routes.RESOURCES.API.V1.LAYER.UPDATE
		.DESCRIPTION]: typeof apiV1LayerUpdateDescriptionLoader
	[Routes.RESOURCES.API.V1.LAYER.UPDATE.NAME]: typeof apiV1LayerUpdateNameLoader
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE
		.COUNT]: typeof apiV1DesignTypeLayoutCountLoader
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE
		.ROWS]: typeof apiV1DesignTypeLayoutRowsLoader
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE
		.COLUMNS]: typeof apiV1DesignTypeLayoutColumnsLoader
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE
		.STYLE]: typeof apiV1DesignTypeLayoutStyleLoader
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.PALETTE.UPDATE
		.VALUE]: typeof apiV1DesignTypePaletteValueLoader
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.SIZE.UPDATE
		.VALUE]: typeof apiV1DesignTypeSizeValueLoader
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.SIZE.UPDATE
		.BASIS]: typeof apiV1DesignTypeSizeBasisLoader
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.SIZE.UPDATE
		.FORMAT]: typeof apiV1DesignTypeSizeFormatLoader
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.FILL.UPDATE
		.VALUE]: typeof apiV1DesignTypeFillValueLoader
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.FILL.UPDATE
		.BASIS]: typeof apiV1DesignTypeFillBasisLoader
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.FILL.UPDATE
		.STYLE]: typeof apiV1DesignTypeFillStyleLoader
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.STROKE.UPDATE
		.VALUE]: typeof apiV1DesignTypeStrokeValueLoader
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.STROKE.UPDATE
		.BASIS]: typeof apiV1DesignTypeStrokeBasisLoader
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.STROKE.UPDATE
		.STYLE]: typeof apiV1DesignTypeStrokeStyleLoader
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LINE.UPDATE
		.BASIS]: typeof apiV1DesignTypeLineBasisLoader
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LINE.UPDATE
		.FORMAT]: typeof apiV1DesignTypeLineFormatLoader
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LINE.UPDATE
		.WIDTH]: typeof apiV1DesignTypeLineWidthLoader
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.ROTATE.UPDATE
		.VALUE]: typeof apiV1DesignTypeRotateValueLoader
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.ROTATE.UPDATE
		.BASIS]: typeof apiV1DesignTypeRotateBasisLoader
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.TEMPLATE.UPDATE
		.STYLE]: typeof apiV1DesignTypeTemplateStyleLoader
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
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER.CREATE]:
		apiV1ArtboardVersionLayerCreateLoader,
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER.DELETE]:
		apiV1ArtboardVersionLayerDeleteLoader,
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER.UPDATE.VISIBLE]:
		apiV1ArtboardVersionLayerUpdateVisibleLoader,
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER.UPDATE.ORDER]:
		apiV1ArtboardVersionLayerUpdateOrderLoader,
	[Routes.RESOURCES.API.V1.LAYER.UPDATE.DESCRIPTION]:
		apiV1LayerUpdateDescriptionLoader,
	[Routes.RESOURCES.API.V1.LAYER.UPDATE.NAME]: apiV1LayerUpdateNameLoader,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE.COUNT]:
		apiV1DesignTypeLayoutCountLoader,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE.ROWS]:
		apiV1DesignTypeLayoutRowsLoader,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE.COLUMNS]:
		apiV1DesignTypeLayoutColumnsLoader,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE.STYLE]:
		apiV1DesignTypeLayoutStyleLoader,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.PALETTE.UPDATE.VALUE]:
		apiV1DesignTypePaletteValueLoader,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.SIZE.UPDATE.VALUE]:
		apiV1DesignTypeSizeValueLoader,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.SIZE.UPDATE.BASIS]:
		apiV1DesignTypeSizeBasisLoader,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.SIZE.UPDATE.FORMAT]:
		apiV1DesignTypeSizeFormatLoader,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.FILL.UPDATE.VALUE]:
		apiV1DesignTypeFillValueLoader,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.FILL.UPDATE.BASIS]:
		apiV1DesignTypeFillBasisLoader,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.FILL.UPDATE.STYLE]:
		apiV1DesignTypeFillStyleLoader,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.STROKE.UPDATE.VALUE]:
		apiV1DesignTypeStrokeValueLoader,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.STROKE.UPDATE.BASIS]:
		apiV1DesignTypeStrokeBasisLoader,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.STROKE.UPDATE.STYLE]:
		apiV1DesignTypeStrokeStyleLoader,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LINE.UPDATE.BASIS]:
		apiV1DesignTypeLineBasisLoader,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LINE.UPDATE.FORMAT]:
		apiV1DesignTypeLineFormatLoader,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LINE.UPDATE.WIDTH]:
		apiV1DesignTypeLineWidthLoader,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.ROTATE.UPDATE.VALUE]:
		apiV1DesignTypeRotateValueLoader,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.ROTATE.UPDATE.BASIS]:
		apiV1DesignTypeRotateBasisLoader,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.TEMPLATE.UPDATE.STYLE]:
		apiV1DesignTypeTemplateStyleLoader,
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
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER
		.CREATE]: typeof apiV1ArtboardVersionLayerCreateAction
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER
		.DELETE]: typeof apiV1ArtboardVersionLayerDeleteAction
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER.UPDATE
		.VISIBLE]: typeof apiV1ArtboardVersionLayerUpdateVisibleAction
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER.UPDATE
		.ORDER]: typeof apiV1ArtboardVersionLayerUpdateOrderAction
	[Routes.RESOURCES.API.V1.LAYER.UPDATE
		.DESCRIPTION]: typeof apiV1LayerUpdateDescriptionAction
	[Routes.RESOURCES.API.V1.LAYER.UPDATE.NAME]: typeof apiV1LayerUpdateNameAction
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE
		.COUNT]: typeof apiV1DesignTypeLayoutCountAction
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE
		.ROWS]: typeof apiV1DesignTypeLayoutRowsAction
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE
		.COLUMNS]: typeof apiV1DesignTypeLayoutColumnsAction
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE
		.STYLE]: typeof apiV1DesignTypeLayoutStyleAction
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.PALETTE.UPDATE
		.VALUE]: typeof apiV1DesignTypePaletteValueAction
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.SIZE.UPDATE
		.VALUE]: typeof apiV1DesignTypeSizeValueAction
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.SIZE.UPDATE
		.BASIS]: typeof apiV1DesignTypeSizeBasisAction
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.SIZE.UPDATE
		.FORMAT]: typeof apiV1DesignTypeSizeFormatAction
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.FILL.UPDATE
		.VALUE]: typeof apiV1DesignTypeFillValueAction
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.FILL.UPDATE
		.BASIS]: typeof apiV1DesignTypeFillBasisAction
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.FILL.UPDATE
		.STYLE]: typeof apiV1DesignTypeFillStyleAction
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.STROKE.UPDATE
		.VALUE]: typeof apiV1DesignTypeStrokeValueAction
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.STROKE.UPDATE
		.BASIS]: typeof apiV1DesignTypeStrokeBasisAction
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.STROKE.UPDATE
		.STYLE]: typeof apiV1DesignTypeStrokeStyleAction
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LINE.UPDATE
		.WIDTH]: typeof apiV1DesignTypeLineWidthAction
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LINE.UPDATE
		.BASIS]: typeof apiV1DesignTypeLineBasisAction
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LINE.UPDATE
		.FORMAT]: typeof apiV1DesignTypeLineFormatAction
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.ROTATE.UPDATE
		.VALUE]: typeof apiV1DesignTypeRotateValueAction
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.ROTATE.UPDATE
		.BASIS]: typeof apiV1DesignTypeRotateBasisAction
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.TEMPLATE.UPDATE
		.STYLE]: typeof apiV1DesignTypeTemplateStyleAction
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
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER.CREATE]:
		apiV1ArtboardVersionLayerCreateAction,
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER.DELETE]:
		apiV1ArtboardVersionLayerDeleteAction,
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER.UPDATE.VISIBLE]:
		apiV1ArtboardVersionLayerUpdateVisibleAction,
	[Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER.UPDATE.ORDER]:
		apiV1ArtboardVersionLayerUpdateOrderAction,
	[Routes.RESOURCES.API.V1.LAYER.UPDATE.DESCRIPTION]:
		apiV1LayerUpdateDescriptionAction,
	[Routes.RESOURCES.API.V1.LAYER.UPDATE.NAME]: apiV1LayerUpdateNameAction,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE.COUNT]:
		apiV1DesignTypeLayoutCountAction,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE.ROWS]:
		apiV1DesignTypeLayoutRowsAction,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE.COLUMNS]:
		apiV1DesignTypeLayoutColumnsAction,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE.STYLE]:
		apiV1DesignTypeLayoutStyleAction,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.PALETTE.UPDATE.VALUE]:
		apiV1DesignTypePaletteValueAction,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.SIZE.UPDATE.VALUE]:
		apiV1DesignTypeSizeValueAction,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.SIZE.UPDATE.BASIS]:
		apiV1DesignTypeSizeBasisAction,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.SIZE.UPDATE.FORMAT]:
		apiV1DesignTypeSizeFormatAction,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.FILL.UPDATE.VALUE]:
		apiV1DesignTypeFillValueAction,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.FILL.UPDATE.BASIS]:
		apiV1DesignTypeFillBasisAction,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.FILL.UPDATE.STYLE]:
		apiV1DesignTypeFillStyleAction,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.STROKE.UPDATE.VALUE]:
		apiV1DesignTypeStrokeValueAction,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.STROKE.UPDATE.BASIS]:
		apiV1DesignTypeStrokeBasisAction,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.STROKE.UPDATE.STYLE]:
		apiV1DesignTypeStrokeStyleAction,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LINE.UPDATE.WIDTH]:
		apiV1DesignTypeLineWidthAction,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LINE.UPDATE.BASIS]:
		apiV1DesignTypeLineBasisAction,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.LINE.UPDATE.FORMAT]:
		apiV1DesignTypeLineFormatAction,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.ROTATE.UPDATE.VALUE]:
		apiV1DesignTypeRotateValueAction,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.ROTATE.UPDATE.BASIS]:
		apiV1DesignTypeRotateBasisAction,
	[Routes.RESOURCES.API.V1.DESIGN.TYPE.TEMPLATE.UPDATE.STYLE]:
		apiV1DesignTypeTemplateStyleAction,
}

export function getActionType<K extends keyof ApiRouteActions>(
	path: K,
): ApiRouteActions[K] {
	const action = actions[path]
	invariant(action, `Router action not found for path: ${path}`)
	return action
}