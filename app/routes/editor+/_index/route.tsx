import { type MetaFunction } from '@remix-run/react'
import { type loader as editorLoader } from '../route.tsx'
import { Container } from './components.tsx'

export default function ProjectsIndexRoute() {
	return <Container />
}

export const meta: MetaFunction<
	null,
	{ 'routes/editor+/route': typeof editorLoader }
> = ({ params, matches }) => {
	const routeMatch = matches.find(m => m.id === 'routes/editor+/route')
	const displayName = routeMatch?.data?.owner.name ?? params.username
	const descriptionEntity = 'Editor'
	return [
		{ title: `${displayName}'s Editor | XYZ` },
		{
			name: 'description',
			content: `Checkout ${displayName}'s ${descriptionEntity} on PPPAAATTT.XYZ`,
		},
	]
}
