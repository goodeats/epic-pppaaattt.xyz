import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type IUser } from '#app/models/user/user.server'
import { EditDesignLineBasisSchema } from '#app/schema/design/line'
import { ValidateDesignSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import {
	type IDesignLineBasis,
	type IDesignAttributesLine,
	type IDesignLine,
} from './line.server'
import { stringifyDesignLineAttributes } from './utils'

export const validateEditBasisDesignLineSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateDesignSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: EditDesignLineBasisSchema,
		strategy,
	})
}

export interface IDesignLineUpdateBasisSubmission {
	userId: IUser['id']
	id: IDesignLine['id']
	basis: IDesignLineBasis
}

interface IDesignLineUpdateBasisData {
	attributes: IDesignAttributesLine
}

export const updateDesignLineBasis = ({
	id,
	data,
}: {
	id: IDesignLine['id']
	data: IDesignLineUpdateBasisData
}) => {
	const { attributes } = data
	const jsonAttributes = stringifyDesignLineAttributes(attributes)
	return prisma.design.update({
		where: { id },
		data: {
			attributes: jsonAttributes,
		},
	})
}
