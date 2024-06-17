import { type IArtworkVersionGenerator } from '#app/definitions/artwork-generator'
import { type IArtworkVersionWithChildren } from '#app/models/artwork-version/artwork-version.server'
import {
	buildDefaultGeneratorLayer,
	buildGeneratorLayers,
} from './build.layers.service'
import { buildGeneratorMetadata } from './build.metadata.service'
import { verifyDefaultGeneratorDesigns } from './build.verify.service'
import { buildGeneratorWatermark } from './build.watermark.service'

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
		const layers = await buildGeneratorLayers({
			version,
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
			layers,
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
