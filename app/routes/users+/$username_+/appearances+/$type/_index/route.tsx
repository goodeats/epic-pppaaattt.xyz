import { type MetaFunction } from '@remix-run/react'
import { transformSlugToTitle } from '#app/utils/string-formatting.ts'
import { type loader as layersLoader } from '../route.tsx'
import { Container } from './components.tsx'

export default function AppearancesTypeIndexRoute() {
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
	const entitiesText = entityCount === 1 ? 'appearance' : 'appearances'
	const type = transformSlugToTitle(params.type || 'Appearance')
	return [
		{ title: `${type} | ${displayName}'s Appearances | XYZ` },
		{
			name: 'description',
			content: `Checkout ${displayName}'s ${entityCount} ${entitiesText} on PPPAAATTT.XYZ`,
		},
	]
}
