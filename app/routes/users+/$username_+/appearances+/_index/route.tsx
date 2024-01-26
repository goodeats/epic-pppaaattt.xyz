import { type MetaFunction } from '@remix-run/react'
import { type loader as layersLoader } from '../route.tsx'
import { Container } from './components.tsx'

export default function LayersIndexRoute() {
	return <Container />
}

export const meta: MetaFunction<
	null,
	{ 'routes/users+/$username_+/appearances': typeof layersLoader }
> = ({ params, matches }) => {
	const entitiesMatch = matches.find(
		m => m.id === 'routes/users+/$username_+/appearances',
	)
	const displayName = entitiesMatch?.data?.owner.name ?? params.username
	const entityCount = entitiesMatch?.data?.owner.appearances.length ?? 0
	const entitiessText = entityCount === 1 ? 'layer' : 'appearances'
	return [
		{ title: `${displayName}'s Appearances | XYZ` },
		{
			name: 'description',
			content: `Checkout ${displayName}'s ${entityCount} ${entitiessText} on PPPAAATTT.XYZ`,
		},
	]
}
