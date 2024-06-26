const pathBase = '/resources/api/v1'

export const Routes = {
	RESOURCES: {
		API: {
			V1: {
				ARTWORK_BRANCH: {
					CREATE: `${pathBase}/artwork-branch/create`,
				},
				ARTWORK_VERSION: {
					CREATE: `${pathBase}/artwork-version/create`,
					UPDATE: {
						BACKGROUND: `${pathBase}/artwork-version/update/background`,
						WIDTH: `${pathBase}/artwork-version/update/width`,
						HEIGHT: `${pathBase}/artwork-version/update/height`,
						PUBLISHED: `${pathBase}/artwork-version/update/published`,
						STARRED: `${pathBase}/artwork-version/update/starred`,
						WATERMARK: `${pathBase}/artwork-version/update/watermark`,
						WATERMARK_COLOR: `${pathBase}/artwork-version/update/watermark-color`,
					},
					DESIGN: {
						CREATE: `${pathBase}/artwork-version/design/create`,
						DELETE: `${pathBase}/artwork-version/design/delete`,
						UPDATE: {
							VISIBLE: `${pathBase}/artwork-version/design/update/visible`,
							ORDER: `${pathBase}/artwork-version/design/update/order`,
						},
					},
					LAYER: {
						CREATE: `${pathBase}/artwork-version/layer/create`,
						DELETE: `${pathBase}/artwork-version/layer/delete`,
						UPDATE: {
							VISIBLE: `${pathBase}/artwork-version/layer/update/visible`,
							ORDER: `${pathBase}/artwork-version/layer/update/order`,
							SELECTED: `${pathBase}/artwork-version/layer/update/selected`,
						},
					},
				},
				ASSET: {
					IMAGE: {
						ARTWORK: {
							CREATE: `${pathBase}/asset/image/artwork/create`,
							DELETE: `${pathBase}/asset/image/artwork/delete`,
							UPDATE: `${pathBase}/asset/image/artwork/update`,
						},
						ARTWORK_VERSION: {
							CREATE: `${pathBase}/asset/image/artwork-version/create`,
							CLONE: `${pathBase}/asset/image/artwork-version/clone`,
							DELETE: `${pathBase}/asset/image/artwork-version/delete`,
							UPDATE: `${pathBase}/asset/image/artwork-version/update`,
							UPDATE_VISIBLE: `${pathBase}/asset/image/artwork-version/update/visible`,
						},
						LAYER: {
							CREATE: `${pathBase}/asset/image/layer/create`,
							DELETE: `${pathBase}/asset/image/layer/delete`,
							UPDATE: `${pathBase}/asset/image/layer/update`,
							UPDATE_VISIBLE: `${pathBase}/asset/image/layer/update/visible`,
						},
						UPDATE: {
							FIT: `${pathBase}/asset/image/update/fit`,
							HIDE_ON_DRAW: `${pathBase}/asset/image/update/hide-on-draw`,
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
