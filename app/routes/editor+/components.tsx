import { useLoaderData } from '@remix-run/react'
import {
	ContainerIndex,
	ContentHeader,
	SideNavHeaderImage,
	SideNavHeaderLink,
	SideNavHeaderTitle,
	SideNavTabs,
} from '#app/components/shared'
import { ContentHeaderActions } from '#app/components/shared/page-layout'
import { getUserImgSrc } from '#app/utils/misc'
import { ArtboardSelector } from './artboard-selector'
import { type loader } from './route'

export const Header = () => {
	const data = useLoaderData<typeof loader>()
	const { owner } = data
	return (
		<ContentHeader title="Editor">
			<ContentHeaderActions>
				<ArtboardSelector artboards={owner.artboards} />
			</ContentHeaderActions>
		</ContentHeader>
	)
}

export const SideNavHeader = () => {
	const data = useLoaderData<typeof loader>()
	const { owner } = data
	const ownerDisplayName = owner.name ?? owner.username
	const title = `${ownerDisplayName}'s Editor`

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

export const NoArtboardContent = () => {
	return <ContainerIndex>Select an Artboard</ContainerIndex>
}

export const NavTabsNoArtboard = () => {
	const NoArtboard = () => {
		return <p>Select an artboard to edit.</p>
	}

	return (
		<SideNavTabs
			defaultValue="artboard"
			values={[
				{
					id: 'artboard',
					name: 'Artboard',
					content: <NoArtboard />,
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
