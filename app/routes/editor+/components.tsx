import { useLoaderData } from '@remix-run/react'
import {
	ContentHeader,
	SideNavHeaderImage,
	SideNavHeaderLink,
	SideNavHeaderTitle,
	SideNavList,
} from '#app/components/shared'
import { getUserImgSrc } from '#app/utils/misc'
import { type loader } from './route'

export const Header = () => {
	return (
		<ContentHeader title="Editor">
			<></>
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

export const List = () => {
	return (
		<SideNavList>
			<></>
		</SideNavList>
	)
}
