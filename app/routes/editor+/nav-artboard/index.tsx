import { useLoaderData } from '@remix-run/react'
import { type loader } from '../route'

export const NavContentArtboard = () => {
	const data = useLoaderData<typeof loader>()
	const { artboard } = data

	const NoArtboard = () => {
		return <p>Select an artboard to edit.</p>
	}

	const WithArtboard = () => {
		if (!artboard) return null

		return <p>Artboard: {artboard.name}</p>
	}

	return (
		<div className="grid h-full items-stretch gap-6">
			<div className="hidden flex-col space-y-4 sm:flex md:order-2">
				{artboard ? <WithArtboard /> : <NoArtboard />}
			</div>
		</div>
	)
}
