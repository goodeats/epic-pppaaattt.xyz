import { type IDesignWithLine, type IDesignWithType } from './design.server'

export interface ILine {
	id: string
	width: number
	createdAt: Date | string
	updatedAt: Date | string
	designId: string
}

export const findLineInDesignArray = ({
	designs,
}: {
	designs: IDesignWithType[]
}): ILine | undefined => {
	const design = designs.find(design => design.line) as IDesignWithLine

	return design.line
}
