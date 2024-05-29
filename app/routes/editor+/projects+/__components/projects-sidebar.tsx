import {
	CollapsibleSidebar,
	NestedEntityNavSidebar,
	SidebarMobile,
} from '#app/components/templates'
import { type NavItem } from '#app/definitions/nav-item'

export const ProjectsSidebar = ({ navItems }: { navItems: NavItem[] }) => {
	return (
		<CollapsibleSidebar>
			<NestedEntityNavSidebar
				items={navItems}
				basePath="/editor/projects"
				headerTitle="Projects"
			/>
		</CollapsibleSidebar>
	)
}

export const ProjectsSidebarMobile = ({
	navItems,
}: {
	navItems: NavItem[]
}) => {
	return (
		<div className="absolute block bg-red-500 md:hidden">
			<SidebarMobile />
		</div>
	)
}
