import { invariant } from '@epic-web/invariant'
import { json, redirect } from '@remix-run/react'
import { prisma } from '#app/utils/db.server'
import { verifySessionStorage } from '#app/utils/verification.server'
import { resetPasswordUsernameSessionKey } from './reset-password'
import { type VerifyFunctionArgs } from './verify.server'

export async function handleVerification({ submission }: VerifyFunctionArgs) {
	invariant(submission.value, 'submission.value should be defined by now')
	const target = submission.value.target
	const user = await prisma.user.findFirst({
		where: { OR: [{ email: target }, { username: target }] },
		select: { email: true, username: true },
	})
	// we don't want to say the user is not found if the email is not found
	// because that would allow an attacker to check if an email is registered
	if (!user) {
		submission.error.code = ['Invalid code']
		return json({ status: 'error', submission } as const, { status: 400 })
	}

	const verifySession = await verifySessionStorage.getSession()
	verifySession.set(resetPasswordUsernameSessionKey, user.username)
	return redirect('/reset-password', {
		headers: {
			'set-cookie': await verifySessionStorage.commitSession(verifySession),
		},
	})
}
