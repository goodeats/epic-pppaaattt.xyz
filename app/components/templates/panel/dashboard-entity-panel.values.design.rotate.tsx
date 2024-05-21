import { memo, useCallback } from 'react'
import { SidebarPanelPopoverFormContainer } from '#app/components/layout/popover'
import { type IDesignWithRotate } from '#app/models/design/design.server'
import { DesignTypeRotateBasis } from '#app/routes/resources+/api.v1+/design.type.rotate.update.basis'
import { DesignTypeRotateValue } from '#app/routes/resources+/api.v1+/design.type.rotate.update.value'
import { type IEntity } from '#app/schema/entity'
import { RotateBasisTypeEnum } from '#app/schema/rotate'
import { SidebarPanelRowValuesContainer } from '..'
import { PanelEntityIconAlt } from './dashboard-entity-panel.icons'
import { PanelEntityPopover } from './dashboard-entity-panel.popover'

interface EntityProps {
	entity: IEntity
}

const EntityPopover = memo(({ entity }: EntityProps) => {
	return (
		<PanelEntityPopover name="Rotate">
			<SidebarPanelPopoverFormContainer>
				<span>Value</span>
				<DesignTypeRotateValue
					design={entity as IDesignWithRotate}
					formLocation="popover"
				/>
			</SidebarPanelPopoverFormContainer>
			<SidebarPanelPopoverFormContainer>
				<span>Basis</span>
				<DesignTypeRotateBasis
					design={entity as IDesignWithRotate}
					formLocation="popover"
				/>
			</SidebarPanelPopoverFormContainer>
		</PanelEntityPopover>
	)
})
EntityPopover.displayName = 'EntityPopover'

const EntityMainForm = memo(({ entity }: EntityProps) => {
	const { rotate } = entity as IDesignWithRotate
	const { basis } = rotate

	if (basis === RotateBasisTypeEnum.DEFINED) {
		return <DesignTypeRotateValue design={entity as IDesignWithRotate} />
	}

	return <DesignTypeRotateBasis design={entity as IDesignWithRotate} />
})
EntityMainForm.displayName = 'EntityMainForm'

const EntityBasisIcon = memo(({ entity }: EntityProps) => {
	const { rotate } = entity as IDesignWithRotate
	const { basis } = rotate

	if (basis !== RotateBasisTypeEnum.DEFINED) return null
	const symbol = '°'

	return <PanelEntityIconAlt symbol={symbol} text={`Rotate basis: ${basis}`} />
})
EntityBasisIcon.displayName = 'EntityBasisIcon'

export const PanelEntityValuesDesignRotate = ({
	entity,
}: {
	entity: IEntity
}) => {
	const entityPopover = useCallback(
		() => <EntityPopover entity={entity} />,
		[entity],
	)

	const entityMainForm = useCallback(
		() => <EntityMainForm entity={entity} />,
		[entity],
	)

	const entityBasisIcon = useCallback(
		() => <EntityBasisIcon entity={entity} />,
		[entity],
	)

	return (
		<SidebarPanelRowValuesContainer>
			{entityPopover()}
			{entityMainForm()}
			{entityBasisIcon()}
		</SidebarPanelRowValuesContainer>
	)
}
