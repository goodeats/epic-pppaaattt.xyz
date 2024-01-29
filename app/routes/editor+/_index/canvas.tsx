import {
	ContainerContent,
	ContainerDetails,
	ContainerHeader,
} from '#app/components/shared'

export const CanvasContent = () => {
	return (
		<ContainerDetails>
			<ContainerHeader>Canvas</ContainerHeader>
			<ContainerContent displayBar={true}>
				<p>yoyo</p>
			</ContainerContent>
		</ContainerDetails>
	)
}
