import { parse } from '@conform-to/zod'
import { z } from 'zod'

// https://sergiodxa.com/tutorials/progressively-enhance-the-usefetcher-hook-in-remix
// using `fetcher.Form` and `fetcher.submit` to handle form submission
// for resource route components that have their own action
// this is a helpful function to still perform the action
// and redirect back to the current page if JS is disabled
export const validateNoJS = ({ formData }: { formData: FormData }) => {
	return (
		z
			// convert "true" to boolean, treat any other value as false
			.preprocess(v => v === 'true', z.boolean())
			.nullable() // allow it to be null
			.default(true) // default to true (support the worst scenario)
			.parse(formData.get('no-js')) // read from formData
	)
}

// use when no intent is found
// let lastSubmission = actionData?.submission not raise error
export const fakeSubmission = ({ formData }: { formData: FormData }) => {
	return parse(formData, { schema: z.any() })
}
