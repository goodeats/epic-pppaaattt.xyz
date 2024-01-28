import { SideNavTabs } from '#app/components/shared'

export const NavTabs = () => {
	return (
		<SideNavTabs
			defaultValue="artboard"
			values={[
				{
					id: 'artboard',
					name: 'Artboard',
					content: 'Make changes to your artboard here.',
				},
				{
					id: 'layers',
					name: 'Layers',
					content: 'Make changes to your artboard layers here.',
				},
			]}
		/>
	)
}
