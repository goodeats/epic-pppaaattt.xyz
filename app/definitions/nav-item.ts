import { type IconName } from '#app/components/ui/icon'

export interface NavItem {
	id: string
	name: string
	path: string
	icon?: IconName // Optional icon name if needed
	children?: NavItem[] // Optional children items
}
