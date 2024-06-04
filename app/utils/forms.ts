import { parse } from '@conform-to/zod'
import { useFetcher } from '@remix-run/react'
import { type z } from 'zod'
import {
	type FillStyleTypeEnum,
	type FillBasisTypeEnum,
} from '#app/schema/fill'
import { type LayoutStyleTypeEnum } from '#app/schema/layout'
import {
	type LineFormatTypeEnum,
	type LineBasisTypeEnum,
} from '#app/schema/line'
import { type RotateBasisTypeEnum } from '#app/schema/rotate'
import {
	type SizeFormatTypeEnum,
	type SizeBasisTypeEnum,
} from '#app/schema/size'
import {
	type StrokeStyleTypeEnum,
	type StrokeBasisTypeEnum,
} from '#app/schema/stroke'
import { type TemplateStyleTypeEnum } from '#app/schema/template'
import { transformEntityEnumValueForSelect } from './string-formatting'

type EnumSchema =
	| typeof FillBasisTypeEnum
	| typeof FillStyleTypeEnum
	| typeof LayoutStyleTypeEnum
	| typeof LineBasisTypeEnum
	| typeof LineFormatTypeEnum
	| typeof RotateBasisTypeEnum
	| typeof SizeBasisTypeEnum
	| typeof StrokeBasisTypeEnum
	| typeof StrokeStyleTypeEnum
	| typeof SizeFormatTypeEnum
	| typeof TemplateStyleTypeEnum

export const schemaEnumToSelectOptions = (enumSchema: EnumSchema) => {
	return Object.values(enumSchema).map(optionEnum => ({
		[optionEnum]: transformEntityEnumValueForSelect(optionEnum),
	}))
}

export const useOptimisticValue = (
	fetcherKey: string,
	schema: z.ZodSchema<any>,
	selectName: string,
) => {
	const fetcher = useFetcher({ key: fetcherKey })
	const { formData } = fetcher

	if (fetcher && formData) {
		const submission = schema.safeParse(formData)

		if (submission.success) {
			return submission.data[selectName]
		} else {
			const parsed = parse(formData, { schema })
			return parsed.value[selectName]
		}
	}
}
