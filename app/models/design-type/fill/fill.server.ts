import { type Fill } from '@prisma/client'
import { type DateOrString } from '#app/definitions/prisma-helper'

// Omitting 'createdAt' and 'updatedAt' from the Base interface
// prisma query returns a string for these fields
type Base = Omit<Fill, 'createdAt' | 'updatedAt'>

export interface IFill extends Base {
	createdAt: DateOrString
	updatedAt: DateOrString
}
