import {
	type IDesignWithPalette,
	type IDesignType,
	type IDesignWithType,
	type IDesignWithSize,
	type IDesignWithFill,
	type IDesignWithStroke,
	type IDesignWithLine,
	type IDesignWithRotate,
	type IDesignWithLayout,
	type IDesignWithTemplate,
	type IDesignsByType,
} from '#app/models/design.server'
import { type PickedArtboardType } from '#app/routes/sketch+/artboards+/$slug_+/queries'
import { type ArtboardSelectedDesignsType } from '#app/schema/artboard'
import { DesignTypeEnum, type designTypeEnum } from '#app/schema/design'
import {
	findFirstDesignIdInArray,
	getNextDesignId,
	getPrevDesignId,
	parseArtboardSelectedDesigns,
} from './artboard'

export const filterAndOrderArtboardDesignsByType = ({
	artboardDesigns,
}: {
	artboardDesigns: IDesignWithType[]
}): IDesignsByType => {
	const designPalettes = orderLinkedDesigns(
		filterDesignsByType(artboardDesigns, 'palette'),
	) as IDesignWithPalette[]
	const designSizes = orderLinkedDesigns(
		filterDesignsByType(artboardDesigns, 'size'),
	) as IDesignWithSize[]
	const designFills = orderLinkedDesigns(
		filterDesignsByType(artboardDesigns, 'fill'),
	) as IDesignWithFill[]
	const designStrokes = orderLinkedDesigns(
		filterDesignsByType(artboardDesigns, 'stroke'),
	) as IDesignWithStroke[]
	const designLines = orderLinkedDesigns(
		filterDesignsByType(artboardDesigns, 'line'),
	) as IDesignWithLine[]
	const designRotates = orderLinkedDesigns(
		filterDesignsByType(artboardDesigns, 'rotate'),
	) as IDesignWithRotate[]
	const designLayouts = orderLinkedDesigns(
		filterDesignsByType(artboardDesigns, 'layout'),
	) as IDesignWithLayout[]
	const designTemplates = orderLinkedDesigns(
		filterDesignsByType(artboardDesigns, 'template'),
	) as IDesignWithTemplate[]

	return {
		designPalettes,
		designSizes,
		designFills,
		designStrokes,
		designLines,
		designRotates,
		designLayouts,
		designTemplates,
	}
}

export const filterDesignsByType = (
	designs: IDesignWithType[],
	type: designTypeEnum,
): IDesignType[] => {
	const typeToPropertyMap: {
		[key in designTypeEnum]: keyof IDesignWithType | null
	} = {
		[DesignTypeEnum.PALETTE]: 'palette',
		[DesignTypeEnum.SIZE]: 'size',
		[DesignTypeEnum.FILL]: 'fill',
		[DesignTypeEnum.STROKE]: 'stroke',
		[DesignTypeEnum.LINE]: 'line',
		[DesignTypeEnum.ROTATE]: 'rotate',
		[DesignTypeEnum.LAYOUT]: 'layout',
		[DesignTypeEnum.TEMPLATE]: 'template',
	}

	const property = typeToPropertyMap[type]

	if (!property) {
		return designs // Or throw an error if the type is not recognized
	}

	return designs
		.filter(
			design => design.type === type.toLowerCase() && design[property] !== null,
		)
		.map(design => ({ ...design, [property]: design[property] as any }))
}

export const orderLinkedDesigns = (designs: IDesignType[]): IDesignType[] => {
	// Step 1: Find the head of the list
	const head = designs.find(design => !design.prevId)
	if (!head) return []

	// Step 2: Sequentially order the designs starting from the head
	const orderedDesigns: IDesignType[] = [head]
	let currentDesign = head
	while (currentDesign.nextId) {
		let nextId = currentDesign.nextId
		const nextDesign = designs.find(design => design.id === nextId)

		if (nextDesign) {
			orderedDesigns.push(nextDesign)
			currentDesign = nextDesign
		} else {
			break
		}
	}

	return orderedDesigns
}

export const filterVisibleDesigns = (designs: IDesignType[]): IDesignType[] => {
	return designs.filter(design => design.visible)
}

export const designsIdArray = (designs: IDesignType[]): string[] => {
	return designs.map(design => design.id)
}

export const selectedDesignToUpdateOnMoveUp = ({
	id,
	selectedDesignId,
	isSelectedDesign,
	visible,
	prevDesignId,
}: {
	id: string
	selectedDesignId: string | null | undefined
	visible: boolean
	isSelectedDesign: boolean
	prevDesignId: string | null
}): string | null | undefined => {
	return isSelectedDesign // if already was selected
		? selectedDesignId // no change
		: !visible // if not visible
		  ? selectedDesignId // no change
		  : selectedDesignId === prevDesignId // if prev design is selected
		    ? id // set to self
		    : selectedDesignId // no change, assumes selected is more than prev
}

export const selectedDesignToUpdateOnMoveDown = ({
	selectedDesignId,
	isSelectedDesign,
	visible,
	nextDesignId,
	nextVisibleDesignId,
}: {
	selectedDesignId: string | null | undefined
	visible: boolean
	isSelectedDesign: boolean
	nextDesignId: string | null | undefined
	nextVisibleDesignId: string | null | undefined
}): string | null | undefined => {
	const nextDesignIsVisible = nextDesignId === nextVisibleDesignId

	return isSelectedDesign || visible // if already was selected
		? nextDesignIsVisible // if next design is visible
			? nextDesignId // set to next
			: selectedDesignId // no change
		: !visible // if not visible
		  ? selectedDesignId // no change
		  : nextDesignIsVisible // if next design is visible
		    ? nextDesignId // set to next
		    : selectedDesignId // no change
}

export const selectedDesignToUpdateOnToggleVisible = ({
	id,
	selectedDesignId,
	isSelectedDesign,
	visible,
	firstVisibleDesignId,
	nextVisibleDesignId,
	orderedDesignIds,
}: {
	id: string
	selectedDesignId: string | null | undefined
	visible: boolean
	firstVisibleDesignId: string | null | undefined
	isSelectedDesign: boolean
	nextVisibleDesignId: string | null | undefined
	orderedDesignIds: string[]
}): string | null | undefined => {
	return visible
		? isSelectedDesign // if visible to not visible
			? nextVisibleDesignId // if selected, set to next
			: selectedDesignId // if not selected, don't change
		: firstVisibleDesignId // if not visible to visible
		  ? findFirstDesignIdInArray(orderedDesignIds, firstVisibleDesignId, id) // if first visible, set to first or self -- whichever is first
		  : id // if no prev visible, set to self
}

export const selectedDesignToUpdateOnDelete = ({
	selectedDesignId,
	isSelectedDesign,
	nextVisibleDesignId,
}: {
	selectedDesignId: string | null | undefined
	isSelectedDesign: boolean
	nextVisibleDesignId: string | null | undefined
}): string | null | undefined => {
	return isSelectedDesign // if already was selected
		? nextVisibleDesignId // set to next visible
		: selectedDesignId // don't change
}

export const selectedDesignsOnUpdate = ({
	id,
	selectedDesignId,
	isSelectedDesign,
	visible,
	prevDesignId,
	nextDesignId,
	nextVisibleDesignId,
	firstVisibleDesignId,
	orderedDesignIds,
}: {
	id: string
	selectedDesignId: string | null | undefined
	visible: boolean
	isSelectedDesign: boolean
	prevDesignId: string | null
	nextDesignId: string | null | undefined
	nextVisibleDesignId: string | null | undefined
	firstVisibleDesignId: string | null | undefined
	orderedDesignIds: string[]
}) => {
	const selectDesignIdOnMoveUp = selectedDesignToUpdateOnMoveUp({
		id,
		selectedDesignId,
		isSelectedDesign,
		visible,
		prevDesignId,
	})

	const selectDesignIdOnMoveDown = selectedDesignToUpdateOnMoveDown({
		selectedDesignId,
		isSelectedDesign,
		visible,
		nextDesignId,
		nextVisibleDesignId,
	})

	const selectDesignIdOnToggleVisible = selectedDesignToUpdateOnToggleVisible({
		id,
		selectedDesignId,
		isSelectedDesign,
		visible,
		firstVisibleDesignId,
		nextVisibleDesignId,
		orderedDesignIds,
	})

	const selectDesignIdOnDelete = selectedDesignToUpdateOnDelete({
		selectedDesignId,
		isSelectedDesign,
		nextVisibleDesignId,
	})

	return {
		selectDesignIdOnMoveUp,
		selectDesignIdOnMoveDown,
		selectDesignIdOnToggleVisible,
		selectDesignIdOnDelete,
	}
}

export const panelListVariablesDesignType = ({
	designs,
	artboard,
	type,
}: {
	designs: IDesignType[]
	artboard: PickedArtboardType
	type: designTypeEnum
}) => {
	const orderedDesigns = orderLinkedDesigns(designs) as IDesignType[]

	// helps with finding first visible design on toggle visible
	const orderedDesignIds = designsIdArray(orderedDesigns)

	// helps with disabling reorder buttons
	const designCount = orderedDesigns.length

	// helps with resetting the selected design for artboard
	const visibleDesigns = filterVisibleDesigns(orderedDesigns)
	const visibleDesignIds = designsIdArray(visibleDesigns)

	// helps with knowing there is a visible design
	const firstVisibleDesignId = visibleDesignIds[0]

	const designKey = (type + 'Id') as keyof ArtboardSelectedDesignsType
	const selectedDesignId = parseArtboardSelectedDesigns({ artboard })[designKey]

	return {
		orderedDesigns,
		orderedDesignIds,
		designCount,
		visibleDesignIds,
		firstVisibleDesignId,
		selectedDesignId,
	}
}

export const panelItemVariablesDesignType = ({
	id,
	selectedDesignId,
	orderedDesignIds,
	visibleDesignIds,
}: {
	id: string
	selectedDesignId: string | null | undefined
	orderedDesignIds: string[]
	visibleDesignIds: string[]
}) => {
	const isSelectedDesign = id === selectedDesignId
	const nextDesignId = getNextDesignId(orderedDesignIds, id)
	const prevDesignId = getPrevDesignId(orderedDesignIds, id)
	const nextVisibleDesignId = getNextDesignId(visibleDesignIds, id)

	return {
		isSelectedDesign,
		nextDesignId,
		prevDesignId,
		nextVisibleDesignId,
	}
}
