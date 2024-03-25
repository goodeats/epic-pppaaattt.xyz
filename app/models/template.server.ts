import { TemplateDataSchema } from '#app/schema/template'
import { prisma } from '#app/utils/db.server'
import {
	type IDesign,
	type IDesignTypeCreateOverrides,
	type IDesignWithTemplate,
	type IDesignWithType,
} from './design.server'

export interface ITemplate {
	id: string
	style: string
	createdAt: Date | string
	updatedAt: Date | string
	designId: string
}

export interface ITemplateCreateOverrides {
	style?: string
}

export const findTemplateInDesignArray = ({
	designs,
}: {
	designs: IDesignWithType[]
}): ITemplate | undefined => {
	const design = designs.find(design => design.template) as IDesignWithTemplate

	return design.template
}

export const createDesignTemplate = ({
	designId,
	designTypeOverrides,
}: {
	designId: IDesign['id']
	designTypeOverrides: IDesignTypeCreateOverrides
}) => {
	const templateData = {
		designId,
		...(designTypeOverrides as ITemplateCreateOverrides),
	}
	const data = TemplateDataSchema.parse(templateData)

	return prisma.template.create({ data })
}
