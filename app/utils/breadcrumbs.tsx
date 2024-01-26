import { Link, useMatches } from '@remix-run/react'
import React from 'react'
import { z } from 'zod'

type MatchData = {
	breadcrumb?: string // or whatever the type of breadcrumb is
}

const UIMatchSchema = z.object({
	params: z.record(z.string().optional()),
})
const BreadcrumbFunctionSchema = z.union([
	z.function(z.tuple([UIMatchSchema]), z.string()),
	z.function(z.tuple([UIMatchSchema]), z.instanceof(React.Component)),
])
export const BreadcrumbHandle = z.object({
	breadcrumb: BreadcrumbFunctionSchema,
})

export type BreadcrumbHandle = z.infer<typeof BreadcrumbHandle>
const BreadcrumbHandleMatch = z.object({
	handle: BreadcrumbHandle,
})

export function useBreadcrumbs() {
	const matches = useMatches()

	const breadcrumbs = matches
		.map(match => {
			const result = BreadcrumbHandleMatch.safeParse(match)
			if (!result.success || !result.data.handle.breadcrumb) return null
			const breadcrumb = result.data.handle.breadcrumb({
				params: match.params || {},
			})
			if (!breadcrumb) return null

			const breadcrumbElement =
				typeof breadcrumb === 'string'
					? breadcrumb
					: React.isValidElement(breadcrumb)
					  ? breadcrumb
					  : null // React.createElement(breadcrumb); // raises error

			if (!breadcrumbElement) return null

			// in the loader set breadcrumb to the name of the data you want to use
			// if there is an id/slug/title/name this is where you want to set it
			const matchDataBreadcrumb = (match.data as MatchData)?.breadcrumb

			return (
				<Link key={match.id} to={match.pathname} className="flex items-center">
					{matchDataBreadcrumb || breadcrumbElement}
				</Link>
			)
		})
		.filter(Boolean)
	return breadcrumbs
}
