import { type Project } from '@prisma/client'
import { NavLink, useLoaderData } from '@remix-run/react'
import {
	SideNavHeaderImage,
	SideNavHeaderLink,
	SideNavHeaderTitle,
	SideNavList,
	SideNavListItem,
	sideNavLinkDefaultClassName,
} from '#app/components/shared'
import { Icon } from '#app/components/ui/icon'
import { cn, getUserImgSrc } from '#app/utils/misc'
import { useOptionalUser } from '#app/utils/user'
import { type loader } from './route'

export const Header = () => {
	const data = useLoaderData<typeof loader>()
	const { owner } = data
	const ownerDisplayName = owner.name ?? owner.username
	const title = `${ownerDisplayName}'s Projects`

	return (
		<SideNavHeaderLink to={`/users/${owner.username}`}>
			<SideNavHeaderImage
				src={getUserImgSrc(owner.image?.id)}
				alt={ownerDisplayName}
			/>
			<SideNavHeaderTitle>{title}</SideNavHeaderTitle>
		</SideNavHeaderLink>
	)
}

export const List = () => {
	const data = useLoaderData<typeof loader>()
	const { owner } = data
	const user = useOptionalUser()
	const isOwner = user?.id === owner.id

	const NewListItem = () => {
		return (
			<SideNavListItem>
				<NavLink
					to="new"
					className={({ isActive }) =>
						cn(sideNavLinkDefaultClassName, isActive && 'bg-accent')
					}
				>
					<Icon name="plus">New Project</Icon>
				</NavLink>
			</SideNavListItem>
		)
	}

	const ListItem = ({ project }: { project: Project }) => {
		const { id, name } = project
		return (
			<SideNavListItem key={id}>
				<NavLink
					to={id}
					preventScrollReset
					prefetch="intent"
					className={({ isActive }) =>
						cn(sideNavLinkDefaultClassName, isActive && 'bg-accent')
					}
				>
					{name}
				</NavLink>
			</SideNavListItem>
		)
	}

	return (
		<SideNavList>
			{isOwner ? <NewListItem /> : null}
			{owner.projects.map(project => (
				<ListItem key={project.id} project={project as Project} />
			))}
		</SideNavList>
	)
}
