export const loadImage = async ({
	src,
}: {
	src: string
}): Promise<HTMLImageElement> => {
	return new Promise((resolve, reject) => {
		const img = new Image()

		img.onload = () => {
			resolve(img)
		}

		img.onerror = () => {
			reject(new Error(`Failed to load image from source: ${src}`))
		}

		// https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
		// add this so we can use the image in a canvas
		// and not get a tainted canvas error
		img.crossOrigin = 'anonymous'

		img.src = src
	})
}
