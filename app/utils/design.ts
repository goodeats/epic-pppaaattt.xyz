import { type IDesignType } from '#app/models/design.server'

export const orderDesigns = (designs: IDesignType[]): IDesignType[] => {
	return designs.reduce((acc: IDesignType[], design) => {
		if (!design.prevId) {
			acc.unshift(design) // Add the head of the list to the start
		} else {
			let currentDesignIndex = acc.findIndex(d => d.id === design.prevId)
			if (currentDesignIndex !== -1) {
				// Insert the design right after its predecessor
				acc.splice(currentDesignIndex + 1, 0, design)
			} else {
				// If predecessor is not found, add it to the end as a fallback
				acc.push(design)
			}
		}
		return acc
	}, [])
}

export const getNextVisibleDesign = (
	designs: IDesignType[],
	currentDesignId: string,
): IDesignType | null => {
	const currentDesignIndex = designs.findIndex(d => d.id === currentDesignId)
	if (currentDesignIndex === -1) {
		return null
	}

	for (let i = currentDesignIndex + 1; i < designs.length; i++) {
		if (designs[i].visible) {
			return designs[i]
		}
	}

	return null
}
