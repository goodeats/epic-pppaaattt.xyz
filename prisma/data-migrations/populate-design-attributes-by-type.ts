import { getDesignsWithType } from '#app/models/design/design.get.server'
import {
	type IDesignWithFill,
	type IDesignWithType,
} from '#app/models/design/design.server'
import { type IDesignAttributesFill } from '#app/models/design/fill/fill.server'
import { stringifyDesignFillAttributes } from '#app/models/design/fill/utils'
import { DesignTypeEnum } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'

// designs will have attributes string as json now
// new prisma migration created the following columns on design table:
// - attributes, updatedAt,

// the goal of this script:
// - for each design
// - - deserialize the attributes from the design type
// - - validate the attributes
// - - update the design with the validated attributes

// after this script runs, there is more work to do:
// - routing, ui, and api changes to support artboard versions and branches

// how to run:
// 1) add the folowing to package.json scripts:
// "data:migrate": "npx vite-node ./prisma/data-migrations/populate-design-attributes-by-type.ts"
// 2) run `npm run data:migrate`
// 3) remove the script from package.json

export const populateDesignAttributesByType = async () => {
	console.log('populateDesignAttributesByType begin 🎬')

	// Step 1: remove all artboard branches and versions from previous runs
	await clear()

	// Step 2: get all designs
	const designs = await getDesigns()

	const designUpdatePromises: Promise<void>[] = []

	// Step 2: update each design with the correct attributes
	for (const design of designs) {
		const updatePromise = updateDesignAttributesPromise(design)
		designUpdatePromises.push(updatePromise)
	}

	// Step 3: wait for all updates to complete
	await Promise.all(designUpdatePromises)

	console.log('populateDesignAttributesByType end 🏁')
}

const clear = async () => {
	await prisma.design.updateMany({
		data: {
			attributes: '{}',
		},
	})
}

const getDesigns = async (): Promise<IDesignWithType[]> => {
	return await getDesignsWithType({ where: {} })
}

const updateDesignAttributesPromise = (design: IDesignWithType) => {
	switch (design.type) {
		case DesignTypeEnum.FILL:
			return updateDesignFillAttributes(design as IDesignWithFill)
		default:
			return Promise.resolve()
		// throw new Error(`Unsupported design type: ${design.type}`)
	}
}

const updateDesignFillAttributes = (design: IDesignWithFill) => {
	const { fill } = design
	const { basis, style, value } = fill
	const attributes = {
		basis,
		style,
		value,
	} as IDesignAttributesFill
	const jsonAttributes = stringifyDesignFillAttributes(attributes)

	return prisma.design
		.update({
			where: { id: design.id },
			data: {
				attributes: jsonAttributes,
			},
		})
		.then(() => {
			console.log(`Updated design fill attributes for design ${design.id}`)
		})
		.catch(error => {
			console.error(
				`Failed to update design fill attributes for design ${design.id}`,
				error,
			)
		})
}

await populateDesignAttributesByType()
