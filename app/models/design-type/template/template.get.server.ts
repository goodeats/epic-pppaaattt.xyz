import {
	type IDesignWithTemplate,
	type IDesignWithType,
} from '#app/models/design/design.server'
import { type ITemplate } from './template.server'

export const findFirstTemplateInDesignArray = ({
	designs,
}: {
	designs: IDesignWithType[]
}): ITemplate | null => {
	const design = designs.find(design => design.template) as IDesignWithTemplate

	return design?.template || null
}
