import { DashboardBody, DashboardContent } from '#app/components/layout'
import { ContainerIndex } from '#app/components/shared'

export default function SketchArtboardsIndexRoute() {
	return (
		<DashboardBody id="sketch-dashboard-body">
			<DashboardContent id="sketch-dashboard-content">
				<ContainerIndex>Select an artboard</ContainerIndex>
			</DashboardContent>
		</DashboardBody>
	)
}
