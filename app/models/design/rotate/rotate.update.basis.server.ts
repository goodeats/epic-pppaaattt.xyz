import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type IUser } from '#app/models/user/user.server'
import { EditDesignRotateBasisSchema } from '#app/schema/design/rotate'
import { ValidateDesignSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import {
	type IDesignRotateBasis,
	type IDesignAttributesRotate,
	type IDesignRotate,
} from './rotate.server'
import { stringifyDesignRotateAttributes } from './utils'

export const validateEditBasisDesignRotateSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateDesignSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: EditDesignRotateBasisSchema,
		strategy,
	})
}

export interface IDesignRotateUpdateBasisSubmission {
	userId: IUser['id']
	id: IDesignRotate['id']
	basis: IDesignRotateBasis
}

interface IDesignRotateUpdateBasisData {
	attributes: IDesignAttributesRotate
}

export const updateDesignRotateBasis = ({
	id,
	data,
}: {
	id: IDesignRotate['id']
	data: IDesignRotateUpdateBasisData
}) => {
	const { attributes } = data
	const jsonAttributes = stringifyDesignRotateAttributes(attributes)
	return prisma.design.update({
		where: { id },
		data: {
			attributes: jsonAttributes,
		},
	})
}
