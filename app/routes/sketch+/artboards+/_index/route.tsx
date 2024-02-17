import {
	ContainerIndex,
	SketchBody,
	SketchBodyContent,
} from '#app/components/shared'

export default function SketchArtboardsIndexRoute() {
	return (
		<SketchBody>
			<SketchBodyContent>
				<ContainerIndex>Select an artboard</ContainerIndex>
			</SketchBodyContent>
		</SketchBody>
	)
}
