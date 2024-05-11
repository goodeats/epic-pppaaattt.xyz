import {
	SidebarPanel,
	SidebarPanelHeader,
	SidebarPanelRow,
	SidebarPanelRowContainer,
} from '#app/components/templates'
import { FormFetcherHex } from '#app/components/templates/form/fetcher/hex'
import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { ArtboardVersionBackgroundSchema } from '#app/schema/artboard-version'
import { Routes } from '#app/utils/routes.const'

export const PanelArtboardVersionBackground = ({
	version,
}: {
	version: IArtboardVersionWithDesignsAndLayers
}) => {
	const route = Routes.RESOURCES.API.V1.ARTBOARD_VERSION.UPDATE.BACKGROUND

	return (
		<SidebarPanel>
			<SidebarPanelHeader title="Background" />
			<SidebarPanelRow>
				<SidebarPanelRowContainer>
					<FormFetcherHex
						entityId={version.id}
						defaultValue={{ background: version.background }}
						route={route}
						formId="panel-form-artboard-version-background"
						schema={ArtboardVersionBackgroundSchema}
					/>
				</SidebarPanelRowContainer>
			</SidebarPanelRow>
		</SidebarPanel>
	)
}
