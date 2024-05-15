import { memo, useCallback } from 'react'
import { ArtboardVersionDesignCreate } from '#app/routes/resources+/api.v1+/artboard-version.design.create'
import { ArtboardVersionLayerCreate } from '#app/routes/resources+/api.v1+/artboard-version.layer.create'
import { type designTypeEnum } from '#app/schema/design'
import {
	EntityParentType,
	type entityParentTypeEnum,
	EntityType,
	type entityTypeEnum,
	type IEntityParentType,
	type IEntityType,
} from '#app/schema/entity'
import { type IDashboardPanelCreateEntityStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import { capitalize } from '#app/utils/string-formatting'
import { SidebarPanelHeader, SidebarPanelRowActionsContainer } from '..'

// the create forms ultimately lead to resource routes with fetchers and actions
// this causes unnecessary rerenders
// enter useCallback and memo
// the create forms are now memoized and only rerendered when the parent type or entity type changes (shouldn't happen)
// this also helps with readability and maintainability when more create forms are added

interface CreateChildEntityFormProps {
	entityType: entityTypeEnum
	parentType?: entityParentTypeEnum
	type?: IEntityType
	parent: { id: string }
}

const ArtboardVersionCreateChildEntityForm = memo(
	({ entityType, type, parent }: CreateChildEntityFormProps) => {
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
	},
)
ArtboardVersionCreateChildEntityForm.displayName =
	'ArtboardVersionCreateChildEntityForm'

const LayerCreateChildEntityForm = memo(
	({ entityType, parent }: CreateChildEntityFormProps) => {
		switch (entityType) {
			case EntityType.DESIGN:
				return 'layer design'
			default:
				console.log('unknown layer entity type', entityType)
				return null
		}
	},
)
LayerCreateChildEntityForm.displayName = 'LayerCreateChildEntityForm'

const CreateEntityForm = memo(
	({ parentType, entityType, type, parent }: CreateChildEntityFormProps) => {
		switch (parentType) {
			case EntityParentType.ARTBOARD_VERSION:
				return (
					<ArtboardVersionCreateChildEntityForm
						entityType={entityType}
						type={type}
						parent={parent}
					/>
				)
			case EntityParentType.LAYER:
				return (
					<LayerCreateChildEntityForm entityType={entityType} parent={parent} />
				)
			default:
				console.log('unknown parent type', parentType)
				return null
		}
	},
)
CreateEntityForm.displayName = 'CreateEntityForm'

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

	const createEntityForm = useCallback(
		() => (
			<CreateEntityForm
				parentType={parentType}
				entityType={entityType}
				type={type}
				parent={parent}
			/>
		),
		[parentType, entityType, type, parent],
	)

	return (
		<SidebarPanelHeader title={capitalize(type)}>
			<SidebarPanelRowActionsContainer>
				{createEntityForm()}
			</SidebarPanelRowActionsContainer>
		</SidebarPanelHeader>
	)
}
