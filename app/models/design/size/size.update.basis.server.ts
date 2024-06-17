import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type IUser } from '#app/models/user/user.server'
import { EditDesignSizeBasisSchema } from '#app/schema/design/size'
import { ValidateDesignSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import {
	type IDesignSizeBasis,
	type IDesignAttributesSize,
	type IDesignSize,
} from './size.server'
import { stringifyDesignSizeAttributes } from './utils'

export const validateEditBasisDesignSizeSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateDesignSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: EditDesignSizeBasisSchema,
		strategy,
	})
}

export interface IDesignSizeUpdateBasisSubmission {
	userId: IUser['id']
	id: IDesignSize['id']
	basis: IDesignSizeBasis
}

interface IDesignSizeUpdateBasisData {
	attributes: IDesignAttributesSize
}

export const updateDesignSizeBasis = ({
	id,
	data,
}: {
	id: IDesignSize['id']
	data: IDesignSizeUpdateBasisData
}) => {
	const { attributes } = data
	const jsonAttributes = stringifyDesignSizeAttributes(attributes)
	return prisma.design.update({
		where: { id },
		data: {
			attributes: jsonAttributes,
		},
	})
}
