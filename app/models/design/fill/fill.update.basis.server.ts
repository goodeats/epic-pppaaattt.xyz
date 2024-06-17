import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type IUser } from '#app/models/user/user.server'
import { EditDesignFillBasisSchema } from '#app/schema/fill'
import { ValidateDesignSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import {
	type IDesignAttributesFill,
	type IDesignFill,
	type IDesignFillBasis,
} from './fill.server'
import { stringifyDesignFillAttributes } from './utils'

export const validateEditBasisDesignFillSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateDesignSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: EditDesignFillBasisSchema,
		strategy,
	})
}

export interface IDesignFillUpdateBasisSubmission {
	userId: IUser['id']
	id: IDesignFill['id']
	basis: IDesignFillBasis
}

interface IDesignFillUpdateBasisData {
	attributes: IDesignAttributesFill
}

export const updateDesignFillBasis = ({
	id,
	data,
}: {
	id: IDesignFill['id']
	data: IDesignFillUpdateBasisData
}) => {
	const { attributes } = data
	const jsonAttributes = stringifyDesignFillAttributes(attributes)
	return prisma.design.update({
		where: { id },
		data: {
			attributes: jsonAttributes,
		},
	})
}
