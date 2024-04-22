import {
	SidebarPanel,
	SidebarPanelHeader,
	SidebarPanelRow,
	SidebarPanelRowContainer,
} from '#app/components/templates'
import { FormFetcherNumber } from '#app/components/templates/form/fetcher/number'
import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import {
	ArtboardVersionHeightSchema,
	ArtboardVersionWidthSchema,
} from '#app/schema/artboard-version'
import { Routes } from '#app/utils/routes.utils'

export const PanelArtboardVersionFrame = ({
	version,
}: {
	version: IArtboardVersionWithDesignsAndLayers
}) => {
	const routeWidth = Routes.RESOURCES.API.V1.ARTBOARD_VERSION.UPDATE.WIDTH
	const routeHeight = Routes.RESOURCES.API.V1.ARTBOARD_VERSION.UPDATE.HEIGHT

	return (
		<SidebarPanel>
			<SidebarPanelHeader title="Frame" />
			<SidebarPanelRow>
				<SidebarPanelRowContainer>
					<FormFetcherNumber
						entityId={version.id}
						defaultValue={{ width: version.width }}
						route={routeWidth}
						formId="panel-form-artboard-version-width"
						schema={ArtboardVersionWidthSchema}
						icon="width"
					/>
					<FormFetcherNumber
						entityId={version.id}
						defaultValue={{ height: version.height }}
						route={routeHeight}
						formId="panel-form-artboard-version-height"
						schema={ArtboardVersionHeightSchema}
						icon="height"
					/>
				</SidebarPanelRowContainer>
			</SidebarPanelRow>
		</SidebarPanel>
	)
}
