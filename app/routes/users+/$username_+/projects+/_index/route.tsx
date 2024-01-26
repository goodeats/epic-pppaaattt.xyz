import { type MetaFunction } from '@remix-run/react'
import { type loader as projectsLoader } from '../route.tsx'
import { Container } from './components.tsx'

export default function ProjectsIndexRoute() {
	return <Container />
}

export const meta: MetaFunction<
	null,
	{ 'routes/users+/$username_+/projects': typeof projectsLoader }
> = ({ params, matches }) => {
	const projectsMatch = matches.find(
		m => m.id === 'routes/users+/$username_+/projects',
	)
	const displayName = projectsMatch?.data?.owner.name ?? params.username
	const projectCount = projectsMatch?.data?.owner.projects.length ?? 0
	const projectsText = projectCount === 1 ? 'project' : 'projects'
	return [
		{ title: `${displayName}'s Projects | XYZ` },
		{
			name: 'description',
			content: `Checkout ${displayName}'s ${projectCount} ${projectsText} on PPPAAATTT.XYZ`,
		},
	]
}
