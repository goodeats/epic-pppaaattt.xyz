export function logger(message: string, ...args: any[]): void {
	const callerLine = new Error().stack?.split('\n')[2]
	const callerFile = callerLine?.split('(')[0]?.trim()
	const callerLineNumber = callerLine?.split(':')[1]?.trim()

	console.log(`[${callerFile}:${callerLineNumber}] ${message}`, ...args)
}
