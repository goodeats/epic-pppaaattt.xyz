import { type Project } from '@prisma/client'
import { Link, NavLink, useLoaderData } from '@remix-run/react'
import {
	BreadcrumbsContainer,
	SideNavHeaderImage,
	SideNavHeaderLink,
	SideNavHeaderTitle,
	SideNavList,
	SideNavListItem,
	sideNavLinkDefaultClassName,
} from '#app/components/shared'
import { Icon } from '#app/components/ui/icon'
import { useBreadcrumbs } from '#app/utils/breadcrumbs'
import { cn, getUserImgSrc } from '#app/utils/misc'
import { useOptionalUser, useUser } from '#app/utils/user'
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
		const { slug, name } = project
		return (
			<SideNavListItem key={slug}>
				<NavLink
					to={slug}
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
				<ListItem key={project.slug} project={project as Project} />
			))}
		</SideNavList>
	)
}

export const Breadcrumbs = () => {
	const user = useUser()
	const breadcrumbs = useBreadcrumbs()

	return (
		<BreadcrumbsContainer>
			<ul className="flex gap-3">
				<li>
					<Link
						className="text-muted-foreground"
						to={`/users/${user.username}`}
					>
						Profile
					</Link>
				</li>
				{breadcrumbs.map((breadcrumb, i, arr) => (
					<li
						key={i}
						className={cn('flex items-center gap-3', {
							'text-muted-foreground': i < arr.length - 1,
						})}
					>
						▶️ {breadcrumb}
					</li>
				))}
			</ul>
		</BreadcrumbsContainer>
	)
}
