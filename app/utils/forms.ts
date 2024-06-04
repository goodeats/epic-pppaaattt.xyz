import {
	type FillStyleTypeEnum,
	type FillBasisTypeEnum,
} from '#app/schema/fill'
import { transformEntityEnumValueForSelect } from './string-formatting'

type EnumSchema = typeof FillBasisTypeEnum | typeof FillStyleTypeEnum

export const schemaEnumToSelectOptions = (enumSchema: EnumSchema) => {
	return Object.values(enumSchema).map(optionEnum => ({
		[optionEnum]: transformEntityEnumValueForSelect(optionEnum),
	}))
}
