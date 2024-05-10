import {
	type IDesignWithStroke,
	type IDesignWithType,
} from '#app/models/design/design.server'
import { type IStroke } from './stroke.server'

export const findFirstStrokeInDesignArray = ({
	designs,
}: {
	designs: IDesignWithType[]
}): IStroke | null => {
	const design = designs.find(design => design.stroke) as IDesignWithStroke

	return design?.stroke || null
}
