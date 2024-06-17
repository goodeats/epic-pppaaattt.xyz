import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type IUser } from '#app/models/user/user.server'
import { EditDesignLayoutStyleSchema } from '#app/schema/design/layout'
import { ValidateDesignSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import {
	type IDesignLayoutStyle,
	type IDesignAttributesLayout,
	type IDesignLayout,
} from './layout.server'
import { stringifyDesignLayoutAttributes } from './utils'

export const validateEditStyleDesignLayoutSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateDesignSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: EditDesignLayoutStyleSchema,
		strategy,
	})
}

export interface IDesignLayoutUpdateStyleSubmission {
	userId: IUser['id']
	id: IDesignLayout['id']
	style: IDesignLayoutStyle
}

interface IDesignLayoutUpdateStyleData {
	attributes: IDesignAttributesLayout
}

export const updateDesignLayoutStyle = ({
	id,
	data,
}: {
	id: IDesignLayout['id']
	data: IDesignLayoutUpdateStyleData
}) => {
	const { attributes } = data
	const jsonAttributes = stringifyDesignLayoutAttributes(attributes)
	return prisma.design.update({
		where: { id },
		data: {
			attributes: jsonAttributes,
		},
	})
}
