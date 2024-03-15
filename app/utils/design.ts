import { type IDesignType } from '#app/models/design.server'
import { findFirstDesignIdInArray } from './artboard'

// this is bad, use the other one
export const orderDesigns = (designs: IDesignType[]): IDesignType[] => {
	// Use reduce to accumulate designs in order based on their prevId
	return designs.reduce((acc: IDesignType[], design) => {
		// Check if the design is the head of the list (has no prevId)
		if (!design.prevId) {
			// If it is the head, add it to the start of the accumulator array
			acc.unshift(design)
		} else {
			// Find the index of the design's predecessor in the accumulator array
			let currentDesignIndex = acc.findIndex(d => d.id === design.prevId)
			if (currentDesignIndex !== -1) {
				// If the predecessor is found, insert the current design right after it
				acc.splice(currentDesignIndex + 1, 0, design)
			} else {
				// If the predecessor is not found, add the current design to the end of the accumulator array
				acc.push(design)
			}
		}
		// Return the updated accumulator array
		return acc
	}, []) // Initialize the accumulator array as empty
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
