import { invariant } from '@epic-web/invariant'
import {
	type IGeneratorDesigns,
	type ILayerGenerator,
	type IArtworkVersionGenerator,
	type IGeneratorWatermark,
	type IArtworkVersionGeneratorMetadata,
} from '#app/definitions/artwork-generator'
import { type IArtworkVersionWithChildren } from '#app/models/artwork-version/artwork-version.server'
import { groupAssetsByType } from '#app/models/asset/utils'
import {
	findManyDesignsWithType,
	type IDesignWithType,
} from '#app/models/design/design.server'
import {
	getArtworkVersionVisiblePalettes,
	getArtworkVersionVisibleRotates,
} from '#app/models/design-artwork-version/design-artwork-version.server'
import {
	getLayerVisiblePalettes,
	getLayerVisibleRotates,
} from '#app/models/design-layer/design-layer.server'
import { type IRotate } from '#app/models/design-type/rotate/rotate.server'
import { type ILayerWithChildren } from '#app/models/layer/layer.server'
import { type rotateBasisTypeEnum } from '#app/schema/rotate'
import { prisma } from '#app/utils/db.server'
import {
	filterSelectedDesignTypes,
	findFirstDesignsByTypeInArray,
	verifySelectedDesignTypesAllPresent,
} from '#app/utils/design'
import { filterLayersVisible } from '#app/utils/layer.utils'
import { orderLinkedItems } from '#app/utils/linked-list.utils'
import { isArrayRotateBasisType } from '#app/utils/rotate'

// "build" since it is creating the version generator each time
// later, if we like the generator, we can save it to the database
export const artworkVersionGeneratorBuildService = async ({
	version,
}: {
	version: IArtworkVersionWithChildren
}): Promise<IArtworkVersionGenerator> => {
	try {
		// Step 1: verify version selected designs are all present
		const { defaultGeneratorDesigns, message } =
			await verifyDefaultGeneratorDesigns({
				version,
			})

		// Step 2: return failure with message if not
		if (!defaultGeneratorDesigns) {
			return {
				id: version.id,
				settings: {
					width: 1000,
					height: 1000,
					background: 'FF0000',
				},
				layers: [],
				success: false,
				message,
			}
		}

		// Step 3: build the version generator layer
		// which will be the global settings for all layers
		const defaultGeneratorLayer = await buildDefaultGeneratorLayer({
			version,
			defaultGeneratorDesigns,
		})

		// Step 4: build the generator layers
		// each layer can override any of the global settings
		const orderedLayers = await orderLinkedItems<ILayerWithChildren>(
			version.layers,
		)
		const generatorLayers = await buildGeneratorLayers({
			layers: orderedLayers,
			defaultGeneratorLayer,
		})

		// Step 5: build the watermark if present
		const watermark = await buildGeneratorWatermark({ version })

		// Step 6: build the metadata
		const metadata = await buildGeneratorMetadata({ version })

		return {
			id: version.id,
			settings: {
				width: version.width,
				height: version.height,
				background: version.background,
			},
			layers: generatorLayers,
			watermark,
			metadata,
			success: true,
			message: 'Artwork version generator created successfully.',
		}
	} catch (error) {
		console.log(error)
		return {
			id: version.id,
			settings: {
				width: 1000,
				height: 1000,
				background: '000000',
			},
			layers: [],
			success: false,
			message: 'Unknown error creating artwork version generator.',
		}
	}
}

const verifyDefaultGeneratorDesigns = async ({
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

// default/global design settings for each layer
// layer can override any of these values
const buildDefaultGeneratorLayer = async ({
	version,
	defaultGeneratorDesigns,
}: {
	version: IArtworkVersionWithChildren
	defaultGeneratorDesigns: IGeneratorDesigns
}): Promise<ILayerGenerator> => {
	const artworkVersionId = version.id

	// get all visible palettes to use for fill or stroke
	const palettes = await getArtworkVersionVisiblePalettes({
		artworkVersionId,
	})

	// get all visible rotates to use for rotate if visible random
	const rotates = await getRotates({
		artworkVersionId,
		rotate: defaultGeneratorDesigns.rotate,
	})

	// container defaults to version dimensions
	const container = getArtworkVersionContainer({ version })

	const assets = groupAssetsByType({ assets: version.assets })

	return {
		...defaultGeneratorDesigns,
		palette: palettes,
		rotates,
		container,
		assets,
	}
}

const getArtworkVersionContainer = ({
	version,
}: {
	version: IArtworkVersionWithChildren
}) => {
	const { width, height } = version
	return {
		width,
		height,
		top: 0,
		left: 0,
		margin: 0,
		canvas: {
			width,
			height,
		},
	}
}

const buildGeneratorLayers = async ({
	layers,
	defaultGeneratorLayer,
}: {
	layers: ILayerWithChildren[]
	defaultGeneratorLayer: ILayerGenerator
}) => {
	const visibleLayers = filterLayersVisible({ layers }) as ILayerWithChildren[]

	return await Promise.all(
		visibleLayers.map(layer =>
			buildGeneratorLayer({
				layer,
				defaultGeneratorLayer,
			}),
		),
	)
}

const buildGeneratorLayer = async ({
	layer,
	defaultGeneratorLayer,
}: {
	layer: ILayerWithChildren
	defaultGeneratorLayer: ILayerGenerator
}): Promise<ILayerGenerator> => {
	const layerId = layer.id

	// Step 1: get all selected designs for the layer
	const layerSelectedDesigns = await getLayerSelectedDesigns({ layerId })

	// Step 2: split the selected designs into the first of each type
	const selectedDesignTypes = findFirstDesignsByTypeInArray({
		designs: layerSelectedDesigns,
	})

	// Step 3: filter the selected designs that are present
	// separate the palette from the rest of the layer generator designs
	// if the layer has no palette we do not want to override the default palette
	const { palette, ...layerGeneratorDesigns } = filterSelectedDesignTypes({
		selectedDesignTypes,
	})

	// Step 4: initialize the generator layer
	// with the default generator layer
	// and the layer generator designs as overrides
	// and layer details
	const { id, name, description } = layer

	const assets = groupAssetsByType({ assets: layer.assets })

	const layerGenerator = {
		...defaultGeneratorLayer,
		...layerGeneratorDesigns,
		id,
		name,
		description,
		assets,
	}

	// Step 5: get all visible palettes to use for fill or stroke
	// if empty, then use the default palette
	const palettes = await getLayerVisiblePalettes({ layerId })
	if (palettes.length > 0) {
		layerGenerator.palette = palettes
	}

	// Step 6: get all visible rotates to use for rotate if visible random
	// if empty, then use the default rotate
	const { rotate } = layerGeneratorDesigns
	if (rotate) {
		const rotates = await getRotates({
			layerId,
			rotate,
		})

		if (rotates.length > 0) {
			layerGenerator.rotates = rotates
		}
	}

	return layerGenerator
}

const getLayerSelectedDesigns = async ({
	layerId,
}: {
	layerId: ILayerWithChildren['id']
}) => {
	return await findManyDesignsWithType({
		where: { layerId, selected: true },
	})
}

const getRotates = async ({
	artworkVersionId,
	layerId,
	rotate,
}: {
	artworkVersionId?: IArtworkVersionWithChildren['id']
	layerId?: ILayerWithChildren['id']
	rotate: IRotate
}) => {
	const allRotates = isArrayRotateBasisType(rotate.basis as rotateBasisTypeEnum)

	if (allRotates) {
		if (artworkVersionId) {
			return await getArtworkVersionVisibleRotates({ artworkVersionId })
		} else if (layerId) {
			return await getLayerVisibleRotates({ layerId })
		}
	}
	return []
}

const buildGeneratorWatermark = async ({
	version,
}: {
	version: IArtworkVersionWithChildren
}): Promise<IGeneratorWatermark | null> => {
	if (!version.watermark) return null

	const userInstagramUrl = await prisma.artworkBranch
		.findUnique({
			where: { id: version.branchId },
			select: {
				owner: {
					select: { sm_url_instagram: true },
				},
			},
		})
		.then(branch => branch?.owner?.sm_url_instagram)

	const text = userInstagramUrl
		? `@${userInstagramUrl.split('/').pop()}`
		: 'PPPAAATTT'

	return {
		text,
		color: version.watermarkColor,
	}
}

const buildGeneratorMetadata = async ({
	version,
}: {
	version: IArtworkVersionWithChildren
}): Promise<IArtworkVersionGeneratorMetadata> => {
	const branch = await prisma.artworkBranch.findUnique({
		where: { id: version.branchId },
		select: {
			id: true,
			name: true,
			slug: true,
			description: true,
			artwork: {
				select: {
					id: true,
					name: true,
					slug: true,
					description: true,
					project: {
						select: {
							id: true,
							name: true,
							slug: true,
							description: true,
						},
					},
					owner: {
						select: {
							id: true,
							name: true,
							username: true,
						},
					},
				},
			},
		},
	})
	invariant(branch, `Branch not found for version ${version.id}`)
	const artwork = branch.artwork
	invariant(artwork, `Artwork not found for branch ${branch.id}`)
	const project = artwork.project
	invariant(project, `Project not found for artwork ${artwork.id}`)
	const owner = artwork.owner
	invariant(owner, `Owner not found for artwork ${artwork.id}`)

	return {
		// version
		versionId: version.id,
		versionName: version.name,
		versionSlug: version.slug,
		versionDescription: version.description,
		// branch
		branchId: version.branchId,
		branchName: branch.name,
		branchSlug: branch.slug,
		branchDescription: branch.description,
		// artwork
		artworkId: artwork.id,
		artworkName: artwork.name,
		artworkSlug: artwork.slug,
		artworkDescription: artwork.description,
		// project
		projectId: project.id,
		projectName: project.name,
		projectSlug: project.slug,
		projectDescription: project.description,
		// owner
		ownerId: owner.id,
		ownerName: owner.name,
		ownerUsername: owner.username,
	}
}
