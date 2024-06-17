import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type IUser } from '#app/models/user/user.server'
import { EditDesignStrokeBasisSchema } from '#app/schema/stroke'
import { ValidateDesignSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import {
	type IDesignAttributesStroke,
	type IDesignStroke,
	type IDesignStrokeBasis,
} from './stroke.server'
import { stringifyDesignStrokeAttributes } from './utils'

export const validateEditBasisDesignStrokeSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateDesignSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: EditDesignStrokeBasisSchema,
		strategy,
	})
}

export interface IDesignStrokeUpdateBasisSubmission {
	userId: IUser['id']
	id: IDesignStroke['id']
	basis: IDesignStrokeBasis
}

interface IDesignStrokeUpdateBasisData {
	attributes: IDesignAttributesStroke
}

export const updateDesignStrokeBasis = ({
	id,
	data,
}: {
	id: IDesignStroke['id']
	data: IDesignStrokeUpdateBasisData
}) => {
	const { attributes } = data
	const jsonAttributes = stringifyDesignStrokeAttributes(attributes)
	return prisma.design.update({
		where: { id },
		data: {
			attributes: jsonAttributes,
		},
	})
}
