import { SideNavTabs } from '#app/components/shared'
import { NavContentArtboard } from './nav-artboard'

export const NavTabs = () => {
	return (
		<SideNavTabs
			defaultValue="artboard"
			values={[
				{
					id: 'artboard',
					name: 'Artboard',
					content: <NavContentArtboard />,
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
