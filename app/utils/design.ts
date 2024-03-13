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
