import { ArtboardVersionDesignCreate } from '#app/routes/resources+/api.v1+/artboard-version.design.create'
import { ArtboardVersionLayerCreate } from '#app/routes/resources+/api.v1+/artboard-version.layer.create'
import { type designTypeEnum } from '#app/schema/design'
import {
	EntityParentType,
	EntityType,
	type IEntityParentType,
	type IEntityType,
} from '#app/schema/entity'
import { type IDashboardPanelCreateEntityStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import { capitalize } from '#app/utils/string-formatting'
import { SidebarPanelHeader, SidebarPanelRowActionsContainer } from '..'

export const PanelEntityHeader = ({
	type,
	parent,
	strategyEntityNew,
}: {
	type: IEntityType
	parent: IEntityParentType
	strategyEntityNew: IDashboardPanelCreateEntityStrategy
}) => {
	const { entityType, parentType } = strategyEntityNew

	const CreateEntityForm = () => {
		switch (parentType) {
			case EntityParentType.ARTBOARD_VERSION:
				return <ArtboardVersionCreateChildEntityForm />
			case EntityParentType.LAYER:
				return <LayerCreateChildEntityForm />
			default:
				console.log('unknown parent type', parentType)
				return null
			// return (
			// 	<FormFetcherIcon
			// 		type={type}
			// 		parentTypeId={strategyEntityNew.parentTypeId}
			// 		parentId={parent.id}
			// 		route={strategyEntityNew.route}
			// 		formId={strategyEntityNew.formId}
			// 		schema={strategyEntityNew.schema}
			// 		icon="plus"
			// 		iconText={strategyEntityNew.iconText}
			// 	/>
			// )
		}
	}

	const ArtboardVersionCreateChildEntityForm = () => {
		switch (entityType) {
			case EntityType.DESIGN:
				return (
					<ArtboardVersionDesignCreate
						type={type as designTypeEnum}
						versionId={parent.id}
					/>
				)
			case EntityType.LAYER:
				return <ArtboardVersionLayerCreate versionId={parent.id} />
			default:
				console.log('unknown artboard version entity type', entityType)
				return null
		}
	}

	const LayerCreateChildEntityForm = () => {
		switch (entityType) {
			case EntityType.DESIGN:
				return 'layer design'
			default:
				console.log('unknown layer entity type', entityType)
				return null
		}
	}

	return (
		<SidebarPanelHeader title={capitalize(type)}>
			<SidebarPanelRowActionsContainer>
				<CreateEntityForm />
			</SidebarPanelRowActionsContainer>
		</SidebarPanelHeader>
	)
}
