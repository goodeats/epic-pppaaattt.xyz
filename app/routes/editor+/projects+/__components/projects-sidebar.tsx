import {
	CollapsibleSidebar,
	NestedEntityNavSidebar,
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
