import { type Stroke } from '@prisma/client'
import { type DateOrString } from '#app/definitions/prisma-helper'

// Omitting 'createdAt' and 'updatedAt' from the Base interface
// prisma query returns a string for these fields
type Base = Omit<Stroke, 'createdAt' | 'updatedAt'>

export interface IStroke extends Base {
	createdAt: DateOrString
	updatedAt: DateOrString
}
