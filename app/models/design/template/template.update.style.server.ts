import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type IUser } from '#app/models/user/user.server'
import { EditDesignTemplateStyleSchema } from '#app/schema/design/template'
import { ValidateDesignSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import {
	type IDesignAttributesTemplate,
	type IDesignTemplate,
	type IDesignTemplateStyle,
} from './template.server'
import { stringifyDesignTemplateAttributes } from './utils'

export const validateEditStyleDesignTemplateSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateDesignSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: EditDesignTemplateStyleSchema,
		strategy,
	})
}

export interface IDesignTemplateUpdateStyleSubmission {
	userId: IUser['id']
	id: IDesignTemplate['id']
	style: IDesignTemplateStyle
}

interface IDesignTemplateUpdateStyleData {
	attributes: IDesignAttributesTemplate
}

export const updateDesignTemplateStyle = ({
	id,
	data,
}: {
	id: IDesignTemplate['id']
	data: IDesignTemplateUpdateStyleData
}) => {
	const { attributes } = data
	const jsonAttributes = stringifyDesignTemplateAttributes(attributes)
	return prisma.design.update({
		where: { id },
		data: {
			attributes: jsonAttributes,
		},
	})
}
