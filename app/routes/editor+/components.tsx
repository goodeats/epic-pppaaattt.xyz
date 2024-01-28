import { useLoaderData } from '@remix-run/react'
import {
	ContentHeader,
	SideNavHeaderImage,
	SideNavHeaderLink,
	SideNavHeaderTitle,
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
