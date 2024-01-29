import { useRouteLoaderData } from '@remix-run/react'
import { ContainerIndex } from '#app/components/shared'
import { type loader as routeLoader } from '../route'
import { CanvasContent } from './canvas'

export const Container = () => {
	const data = useRouteLoaderData<typeof routeLoader>('routes/editor+/route')

	const NoArtboard = () => {
		return <ContainerIndex>Select an Artboard</ContainerIndex>
	}

	const WithArtboard = () => {
		return <CanvasContent />
	}

	return data?.artboard ? <WithArtboard /> : <NoArtboard />
}
