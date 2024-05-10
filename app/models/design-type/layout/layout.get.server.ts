import {
	type IDesignWithLayout,
	type IDesignWithType,
} from '#app/models/design/design.server'
import { type ILayout } from './layout.server'

export const findFirstLayoutInDesignArray = ({
	designs,
}: {
	designs: IDesignWithType[]
}): ILayout | null => {
	const design = designs.find(design => design.layout) as IDesignWithLayout

	return design?.layout || null
}
