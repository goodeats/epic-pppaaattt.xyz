export const INTENT = {
	// artboard design actions
	artboardCreateDesign: 'create-artboard-design' as const,
	artboardReorderDesign: 'reorder-artboard-design' as const,
	artboardToggleVisibilityDesign: 'toggle-visibility-artboard-design' as const,
	artboardDeleteDesign: 'delete-artboard-design' as const,
	// artboard design palette actions
	artboardUpdateDesignPalette: 'update-artboard-design-palette' as const,
	// artboard design size actions
	artboardCreateDesignSize: 'create-artboard-design-size' as const,
	artboardUpdateDesignSize: 'update-artboard-design-size' as const,
	// artboard design fill actions
	artboardCreateDesignFill: 'create-artboard-design-fill' as const,
	artboardUpdateDesignFill: 'update-artboard-design-fill' as const,
	artboardUpdateDesignFillStyle: 'update-artboard-design-fill-style' as const,
	artboardUpdateDesignFillBasis: 'update-artboard-design-fill-basis' as const,
	// artboard design stroke actions
	artboardCreateDesignStroke: 'create-artboard-design-stroke' as const,
	artboardUpdateDesignStroke: 'update-artboard-design-stroke' as const,
	artboardUpdateDesignStrokeStyle:
		'update-artboard-design-stroke-style' as const,
	artboardUpdateDesignStrokeBasis:
		'update-artboard-design-stroke-basis' as const,
	// artboard design line actions
	artboardCreateDesignLine: 'create-artboard-design-line' as const,
	artboardUpdateDesignLineWidth: 'update-artboard-design-line-width' as const,
	// artboard design rotate actions
	artboardCreateDesignRotate: 'create-artboard-design-rotate' as const,
	artboardUpdateDesignRotate: 'update-artboard-design-rotate' as const,
	artboardUpdateDesignRotateBasis:
		'update-artboard-design-rotate-basis' as const,
	// artboard design layout actions
	artboardCreateDesignLayout: 'create-artboard-design-layout' as const,
	artboardUpdateDesignLayoutStyle:
		'update-artboard-design-layout-style' as const,
	artboardUpdateDesignLayoutCount:
		'update-artboard-design-layout-count' as const,
	artboardUpdateDesignLayoutRows: 'update-artboard-design-layout-rows' as const,
	artboardUpdateDesignLayoutColumns:
		'update-artboard-design-layout-columns' as const,
	// artboard design template actions
	artboardCreateDesignTemplate: 'create-artboard-design-template' as const,
	artboardUpdateDesignTemplateStyle:
		'update-artboard-design-template-style' as const,
	// artboard layer actions
	artboardCreateLayer: 'create-artboard-layer' as const,
	artboardUpdateLayerName: 'update-artboard-layer-name' as const,
	artboardUpdateLayerDescription: 'update-artboard-layer-description' as const,
	artboardToggleVisibilityLayer: 'toggle-visibility-artboard-layer' as const,
	artboardDeleteLayer: 'delete-artboard-layer' as const,
	artboardReorderLayer: 'reorder-artboard-layer' as const,
}

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
}

export const DESIGN_ROTATE_INTENT = {
	updateDesignRotateRotation: 'update-design-rotate-rotation' as const,
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
