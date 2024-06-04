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
