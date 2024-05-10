import { type Layout } from '@prisma/client'
import { type DateOrString } from '#app/definitions/prisma-helper'

// Omitting 'createdAt' and 'updatedAt' from the Base interface
// prisma query returns a string for these fields
type Base = Omit<Layout, 'createdAt' | 'updatedAt'>

export interface ILayout extends Base {
	createdAt: DateOrString
	updatedAt: DateOrString
}
