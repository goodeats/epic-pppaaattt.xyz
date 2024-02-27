// for using with actions that have multiple intents

export interface IntentActionArgs {
	request: Request
	userId: string
	formData: FormData
}
