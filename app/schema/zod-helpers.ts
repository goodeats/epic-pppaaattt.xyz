// using these for template/form/fetchers

import { z } from 'zod'

// where the input value could be from different etities and attributes
export type defaultValueString = {
	[key: string]: string
}
export type defaultValueNumber = {
	[key: string]: number
}
export type defaultValueStringOrNumber = {
	[key: string]: string | number | null | undefined
}

// use this for schema validation where the value is a string or null
// helpful for queries on doubly-linked list items (head/tail)
export const zodStringOrNull = z.union([z.string(), z.null()])
