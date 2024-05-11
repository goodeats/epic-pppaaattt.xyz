import { type ExtractStringValues } from './typescript-helpers'

export type RoutePath = ExtractStringValues<typeof Routes>
const pathBase = '/resources/api/v1'

export const Routes = {
	RESOURCES: {
		API: {
			V1: {
				ARTBOARD_BRANCH: {
					CREATE: `${pathBase}/artboard-branch/create`,
				},
				ARTBOARD_VERSION: {
					CREATE: `${pathBase}/artboard-version/create`,
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
							SELECTED: `${pathBase}/artboard-version/layer/update/selected`,
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
					DESIGN: {
						CREATE: `${pathBase}/layer/design/create`,
						DELETE: `${pathBase}/layer/design/delete`,
						UPDATE: {
							VISIBLE: `${pathBase}/layer/design/update/visible`,
							ORDER: `${pathBase}/layer/design/update/order`,
						},
					},
				},
			},
		},
	},
} as const
