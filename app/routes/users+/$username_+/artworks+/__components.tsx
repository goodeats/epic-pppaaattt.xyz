import {
	Link,
	NavLink,
	type UIMatch,
	useLoaderData,
	useMatches,
} from '@remix-run/react'
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
import { type IArtworkWithProject } from '#app/models/artwork/artwork.server'
import { useBreadcrumbs } from '#app/utils/breadcrumbs'
import { cn, getUserImgSrc } from '#app/utils/misc'
import { useOptionalUser, useUser } from '#app/utils/user'
import { type loader } from './route'

interface MatchData {
	project?: {
		name: string
		slug: string
	}
}

export const Header = () => {
	const data = useLoaderData<typeof loader>()
	const { owner } = data
	const ownerDisplayName = owner.name ?? owner.username
	const title = `${ownerDisplayName}'s Artworks`

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

// checks for current artwork's project slug
// then filters artworks by that project slug
// link to artwork's project at the top of the list
export const List = () => {
	const data = useLoaderData<typeof loader>()
	const matches = useMatches()
	const { owner } = data

	const matchWithProjects = matches.find((match: UIMatch<unknown, unknown>) => {
		const matchData = match.data as MatchData
		return matchData && matchData.project
	})

	const project = (matchWithProjects?.data as MatchData)?.project
	const projectSlug = project?.slug

	const user = useOptionalUser()
	const isOwner = user?.id === owner.id

	const ParentListItem = () => {
		if (!project) return null

		return (
			<SideNavListItem>
				<NavLink
					to={`/users/${owner.username}/projects/${project.slug}`}
					className={({ isActive }) =>
						cn(
							sideNavLinkDefaultClassName,
							isActive ? 'bg-accent' : 'bg-primary text-primary-foreground',
						)
					}
				>
					<Icon name="arrow-left">{project.name}</Icon>
				</NavLink>
			</SideNavListItem>
		)
	}

	const ListItem = ({ artwork }: { artwork: IArtworkWithProject }) => {
		const { slug, name } = artwork
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
			{isOwner ? <ParentListItem /> : null}
			{owner.artworks.map(artwork => {
				const artworkProject = artwork.project.slug

				if (artworkProject !== projectSlug) return null
				return (
					<ListItem
						key={artwork.slug}
						artwork={artwork as IArtworkWithProject}
					/>
				)
			})}
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
