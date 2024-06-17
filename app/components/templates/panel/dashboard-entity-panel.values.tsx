import { type IAssetImage } from '#app/models/asset/image/image.server'
import { AssetTypeEnum } from '#app/schema/asset'
import { DesignTypeEnum } from '#app/schema/design'
import {
	type IEntityParentType,
	type IEntity,
	type IEntityType,
} from '#app/schema/entity'
import { PanelEntityValuesAssetImage } from './dashboard-entity-panel.values.asset.image'
import { PanelEntityValuesDesignFill } from './dashboard-entity-panel.values.design.fill'
import { PanelEntityValuesDesignLayout } from './dashboard-entity-panel.values.design.layout'
import { PanelEntityValuesDesignLine } from './dashboard-entity-panel.values.design.line'
import { PanelEntityValuesDesignPalette } from './dashboard-entity-panel.values.design.palette'
import { PanelEntityValuesDesignRotate } from './dashboard-entity-panel.values.design.rotate'
import { PanelEntityValuesDesignSize } from './dashboard-entity-panel.values.design.size'
import { PanelEntityValuesDesignStroke } from './dashboard-entity-panel.values.design.stroke'
import { PanelEntityValuesDesignTemplate } from './dashboard-entity-panel.values.design.template'
import { PanelEntityValuesLayer } from './dashboard-entity-panel.values.layer'

export const PanelEntityValues = ({
	type,
	entity,
	parent,
}: {
	type: IEntityType
	entity: IEntity
	parent: IEntityParentType
}) => {
	if (type === 'layer') {
		return <PanelEntityValuesLayer entity={entity} parent={parent} />
	}

	switch (type) {
		case AssetTypeEnum.IMAGE:
			return <PanelEntityValuesAssetImage entity={entity as IAssetImage} />
		case DesignTypeEnum.FILL:
			return <PanelEntityValuesDesignFill entity={entity} />
		case DesignTypeEnum.LAYOUT:
			return <PanelEntityValuesDesignLayout entity={entity} />
		case DesignTypeEnum.LINE:
			return <PanelEntityValuesDesignLine entity={entity} />
		case DesignTypeEnum.PALETTE:
			return <PanelEntityValuesDesignPalette entity={entity} />
		case DesignTypeEnum.SIZE:
			return <PanelEntityValuesDesignSize entity={entity} />
		case DesignTypeEnum.STROKE:
			return <PanelEntityValuesDesignStroke entity={entity} />
		case DesignTypeEnum.ROTATE:
			return <PanelEntityValuesDesignRotate entity={entity} />
		case DesignTypeEnum.TEMPLATE:
			return <PanelEntityValuesDesignTemplate entity={entity} />
		default:
			return 'Default'
	}
}
