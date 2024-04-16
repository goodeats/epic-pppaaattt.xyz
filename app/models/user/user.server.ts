import { type User } from '@sentry/remix'
import { type DateOrString } from '#app/definitions/prisma-helper'

// Omitting 'createdAt' and 'updatedAt' from the User interface
// prisma query returns a string for these fields
type BaseUser = Omit<User, 'createdAt' | 'updatedAt'>

export interface IUser extends BaseUser {
	createdAt: DateOrString
	updatedAt: DateOrString
}

export interface IUserBasic {
	id: string
	username: string
	name: string | null
	image: { id: string | null }
}
