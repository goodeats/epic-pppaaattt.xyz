import {
	type IDesignWithLine,
	type IDesignWithType,
} from '#app/models/design/design.server'
import { type ILine } from './line.server'

export const findFirstLineInDesignArray = ({
	designs,
}: {
	designs: IDesignWithType[]
}): ILine | null => {
	const design = designs.find(design => design.line) as IDesignWithLine

	return design?.line || null
}
