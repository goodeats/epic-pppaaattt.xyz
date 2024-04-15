import { DashboardBody, DashboardContent } from '#app/components/layout'
import { ContainerIndex } from '#app/components/shared'

export default function SketchIndexRoute() {
	return (
		<DashboardBody id="sketch-dashboard-body">
			<DashboardContent id="sketch-dashboard-content">
				<ContainerIndex>Select something to sketch</ContainerIndex>
			</DashboardContent>
		</DashboardBody>
	)
}
