import { type IDesignWithTemplate, type IDesignWithType } from './design.server'

export interface ITemplate {
	id: string
	style: string
	createdAt: Date | string
	updatedAt: Date | string
	designId: string
}

export const findTemplateInDesignArray = ({
	designs,
}: {
	designs: IDesignWithType[]
}): ITemplate | undefined => {
	const design = designs.find(design => design.template) as IDesignWithTemplate

	return design.template
}
