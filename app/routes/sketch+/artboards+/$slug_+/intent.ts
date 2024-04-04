// artboard actions
export const ARTBOARD_INTENT = {
	updateArtboardWidth: 'update-artboard-width' as const,
	updateArtboardHeight: 'update-artboard-height' as const,
	updateArtboardBackgroundColor: 'update-artboard-background-color' as const,
}

// artboard design actions
export const ARTBOARD_DESIGN_INTENT = {
	artboardCreateDesign: 'create-artboard-design' as const,
	artboardReorderDesign: 'reorder-artboard-design' as const,
	artboardToggleVisibleDesign: 'toggle-visible-artboard-design' as const,
	artboardDeleteDesign: 'delete-artboard-design' as const,
}

// artboard layer actions
export const ARTBOARD_LAYER_INTENT = {
	artboardCreateLayer: 'create-artboard-layer' as const,
	artboardReorderLayer: 'reorder-artboard-layer' as const,
	artboardToggleVisibleLayer: 'toggle-visible-artboard-layer' as const,
	artboardDeleteLayer: 'delete-artboard-layer' as const,
}

// layer actions
export const LAYER_INTENT = {
	updateLayerName: 'update-layer-name' as const,
	updateLayerDescription: 'update-layer-description' as const,
}

// layer design actions
export const LAYER_DESIGN_INTENT = {
	layerCreateDesign: 'create-layer-design' as const,
	layerReorderDesign: 'reorder-layer-design' as const,
	layerToggleVisibleDesign: 'toggle-visible-layer-design' as const,
	layerDeleteDesign: 'delete-layer-design' as const,
}

// design typs actions
export const DESIGN_PALETTE_INTENT = {
	updateDesignPaletteValue: 'update-design-palette-value' as const,
}

export const DESIGN_SIZE_INTENT = {
	updateDesignSizeValue: 'update-design-size-value' as const,
	updateDesignSizeBasis: 'update-design-size-basis' as const,
	updateDesignSizeFormat: 'update-design-size-format' as const,
}

export const DESIGN_FILL_INTENT = {
	updateDesignFillValue: 'update-design-fill-value' as const,
	updateDesignFillStyle: 'update-design-fill-style' as const,
	updateDesignFillBasis: 'update-design-fill-basis' as const,
}

export const DESIGN_STROKE_INTENT = {
	updateDesignStrokeValue: 'update-design-stroke-value' as const,
	updateDesignStrokeStyle: 'update-design-stroke-style' as const,
	updateDesignStrokeBasis: 'update-design-stroke-basis' as const,
}

export const DESIGN_LINE_INTENT = {
	updateDesignLineWidth: 'update-design-line-width' as const,
	updateDesignLineBasis: 'update-design-line-basis' as const,
	updateDesignLineFormat: 'update-design-line-format' as const,
}

export const DESIGN_ROTATE_INTENT = {
	updateDesignRotateValue: 'update-design-rotate-value' as const,
	updateDesignRotateBasis: 'update-design-rotate-basis' as const,
}

export const DESIGN_LAYOUT_INTENT = {
	updateDesignLayoutStyle: 'update-design-layout-style' as const,
	updateDesignLayoutCount: 'update-design-layout-count' as const,
	updateDesignLayoutRows: 'update-design-layout-rows' as const,
	updateDesignLayoutColumns: 'update-design-layout-columns' as const,
}

export const DESIGN_TEMPLATE_INTENT = {
	updateDesignTemplateStyle: 'update-design-template-style' as const,
}

export type IntentDesignCreate =
	| typeof ARTBOARD_DESIGN_INTENT.artboardCreateDesign
	| typeof LAYER_DESIGN_INTENT.layerCreateDesign

export type IntentDesignReorder =
	| typeof ARTBOARD_DESIGN_INTENT.artboardReorderDesign
	| typeof LAYER_DESIGN_INTENT.layerReorderDesign

export type IntentDesignToggleVisible =
	| typeof ARTBOARD_DESIGN_INTENT.artboardToggleVisibleDesign
	| typeof LAYER_DESIGN_INTENT.layerToggleVisibleDesign

export type IntentDesignDelete =
	| typeof ARTBOARD_DESIGN_INTENT.artboardDeleteDesign
	| typeof LAYER_DESIGN_INTENT.layerDeleteDesign
