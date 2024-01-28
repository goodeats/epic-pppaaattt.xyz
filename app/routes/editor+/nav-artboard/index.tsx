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

		const { name, description, width, height, backgroundColor } = artboard

		return (
			<div>
				<p>Artboard: {name}</p>
				<p>{description}</p>
				<p>
					{width} x {height}
				</p>
				<p>{backgroundColor}</p>
			</div>
		)
	}

	return (
		<div className="grid h-full items-stretch gap-6">
			<div className="hidden flex-col space-y-4 sm:flex md:order-2">
				{artboard ? <WithArtboard /> : <NoArtboard />}
			</div>
		</div>
	)
}
