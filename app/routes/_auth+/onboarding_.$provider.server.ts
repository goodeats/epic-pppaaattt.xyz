import { invariant } from '@epic-web/invariant'
import { redirect } from '@remix-run/react'
import { verifySessionStorage } from '#app/utils/verification.server'
import { onboardingEmailSessionKey } from './onboarding_.$provider'
import { type VerifyFunctionArgs } from './verify.server'

export async function handleVerification({ submission }: VerifyFunctionArgs) {
	invariant(submission.value, 'submission.value should be defined by now')
	const verifySession = await verifySessionStorage.getSession()
	verifySession.set(onboardingEmailSessionKey, submission.value.target)
	return redirect('/onboarding', {
		headers: {
			'set-cookie': await verifySessionStorage.commitSession(verifySession),
		},
	})
}
