import { type IGeneratorDesigns } from '#app/definitions/artwork-generator'
import { type IArtworkVersionWithChildren } from '#app/models/artwork-version/artwork-version.server'
import {
	type IDesignWithType,
	findManyDesignsWithType,
} from '#app/models/design/design.server'
import {
	findFirstDesignsByTypeInArray,
	verifySelectedDesignTypesAllPresent,
} from '#app/utils/design'

export const verifyDefaultGeneratorDesigns = async ({
	version,
}: {
	version: IArtworkVersionWithChildren
}): Promise<{
	defaultGeneratorDesigns: IGeneratorDesigns | null
	message: string
}> => {
	// Step 1: get all selected designs for the version
	// design table has `selected: boolean` field
	const selectedDesigns = await getVersionSelectedDesigns({
		artworkVersionId: version.id,
	})

	// Step 2: split the selected designs into the first of each type
	const selectedDesignTypes = findFirstDesignsByTypeInArray({
		designs: selectedDesigns,
	})

	// Step 3: validate that all selected design types are present
	// message will indicate which design type is missing
	const { success, message } = verifySelectedDesignTypesAllPresent({
		selectedDesignTypes,
	})

	// Step 4: return failure with message if selected designs are not valid
	if (!success) {
		return {
			message,
			defaultGeneratorDesigns: null,
		}
	}

	// Step 5: reformat the selected designs to be generator designs
	// this is to ensure that the selected designs are not null
	const defaultGeneratorDesigns = {
		...selectedDesignTypes,
		palette: [selectedDesignTypes.palette],
	} as IGeneratorDesigns

	return {
		defaultGeneratorDesigns,
		message: 'Version generator designs are present.',
	}
}

const getVersionSelectedDesigns = async ({
	artworkVersionId,
}: {
	artworkVersionId: IArtworkVersionWithChildren['id']
}): Promise<IDesignWithType[]> => {
	return await findManyDesignsWithType({
		where: { artworkVersionId, selected: true },
	})
}
