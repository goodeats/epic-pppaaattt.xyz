import { NavLink } from '@remix-run/react'
import {
	NavSidebar,
	NavSidebarContent,
	NavSidebarList,
	NavSidebarListItem,
	NavSidebarListItemContainer,
	NavSidebarListItemLinkContainer,
	navSidebarLinkClassNameActive,
	navSidebarLinkClassNameDefault,
} from '#app/components/layout'
import { Icon, type IconName } from '#app/components/ui/icon'
import { type NavItem } from '#app/definitions/nav-item'
import { cn } from '#app/utils/misc'

export const NestedEntityNavSidebar = ({
	items,
	basePath,
	headerTitle,
}: {
	items: NavItem[]
	basePath: string
	headerTitle: string
}) => {
	return (
		<NavSidebar>
			<NavSidebarContent>
				{/* header */}
				<NavSidebarListItem>
					<NavSidebarListItemContainer>
						<NavListItemLink to={basePath} name={headerTitle} />
					</NavSidebarListItemContainer>
					<NavList items={items} basePath={basePath} />
				</NavSidebarListItem>
			</NavSidebarContent>
		</NavSidebar>
	)
}

export const NavList = ({
	items,
	basePath,
}: {
	items: NavItem[]
	basePath: string
}) => {
	return (
		<NavSidebarList className="pl-2">
			{items.map(item => (
				<NavListItem key={item.id} item={item} basePath={basePath} />
			))}
		</NavSidebarList>
	)
}

export const NavListItem = ({
	item,
	basePath,
}: {
	item: NavItem
	basePath: string
}) => {
	const hasChildren = item.children && item.children.length > 0

	return (
		<NavSidebarListItem>
			<NavSidebarListItemContainer>
				<NavListItemLink
					to={`${basePath}/${item.path}`}
					name={item.name}
					icon={item.icon}
				/>
			</NavSidebarListItemContainer>
			{hasChildren && (
				<NavList items={item.children || []} basePath={basePath} />
			)}
		</NavSidebarListItem>
	)
}

export const NavListItemLink = ({
	to,
	name,
	icon,
}: {
	to: string
	name: string
	icon?: IconName
}) => {
	return (
		<NavSidebarListItemLinkContainer>
			<NavLink
				to={to}
				className={({ isActive }) =>
					cn(
						navSidebarLinkClassNameDefault,
						isActive && navSidebarLinkClassNameActive,
					)
				}
			>
				{icon ? (
					<Icon className="text-body-md" name={icon}>
						{name}
					</Icon>
				) : (
					<span>{name}</span>
				)}
			</NavLink>
		</NavSidebarListItemLinkContainer>
	)
}
