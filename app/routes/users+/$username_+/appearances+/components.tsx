import { type Appearance } from '@prisma/client'
import { Link, NavLink, useLoaderData, useParams } from '@remix-run/react'
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
	const title = `${ownerDisplayName}'s Appearances`

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
	const params = useParams()
	const { type } = params
	const { owner, appearances } = data
	const user = useOptionalUser()
	const isOwner = user?.id === owner.id

	const ParentListItem = () => {
		return (
			<SideNavListItem>
				<NavLink
					to={`/users/${owner.username}/appearances`}
					className={({ isActive }) =>
						cn(
							sideNavLinkDefaultClassName,
							isActive ? 'bg-accent' : 'bg-primary text-primary-foreground',
						)
					}
				>
					<Icon name="arrow-left">Appearances</Icon>
				</NavLink>
			</SideNavListItem>
		)
	}

	const ListItem = ({ appearance }: { appearance: Appearance }) => {
		const { slug, name } = appearance
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

	const AppearanceList = () => {
		return (
			<SideNavList>
				{appearances.map(appearance => {
					return (
						<ListItem
							key={appearance.slug}
							appearance={appearance as Appearance}
						/>
					)
				})}
			</SideNavList>
		)
	}

	const AppearanceTypeList = () => {
		return (
			<SideNavList>
				{isOwner ? <ParentListItem /> : null}
				{appearances.map(appearance => {
					if (type && appearance.slug !== type) return null

					return (
						<ListItem
							key={appearance.slug}
							appearance={appearance as Appearance}
						/>
					)
				})}
			</SideNavList>
		)
	}

	return type ? <AppearanceTypeList /> : <AppearanceList />
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
