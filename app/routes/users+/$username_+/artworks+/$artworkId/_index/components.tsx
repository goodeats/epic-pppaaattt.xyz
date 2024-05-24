import { useLoaderData } from '@remix-run/react'
import {
	ContainerContent,
	ContainerHeader,
	ContainerP,
	FooterActions,
	FooterContainer,
	FooterLinkButton,
	FooterTimestamp,
} from '#app/components/shared'
import { userHasPermission, useOptionalUser } from '#app/utils/user'
import { DeletePermission } from './delete-artwork-form'
import { type loader } from './route'

export const Header = () => {
	const data = useLoaderData<typeof loader>()
	return <ContainerHeader>{data.artwork.name}</ContainerHeader>
}

export const Content = () => {
	const data = useLoaderData<typeof loader>()
	const artwork = data.artwork
	const user = useOptionalUser()
	const isOwner = user?.id === artwork.ownerId
	const canDelete = userHasPermission(
		user,
		isOwner ? `delete:artwork:own` : `delete:artwork:any`,
	)
	const displayBar = canDelete || isOwner
	return (
		<ContainerContent displayBar={displayBar}>
			<ContainerP>Visible: {artwork.isVisible ? 'Yes' : 'No'}</ContainerP>
			<ContainerP>{artwork.description}</ContainerP>
		</ContainerContent>
	)
}

export const Footer = () => {
	const data = useLoaderData<typeof loader>()
	const artwork = data.artwork
	const user = useOptionalUser()
	const isOwner = user?.id === artwork.ownerId
	const canDelete = userHasPermission(
		user,
		isOwner ? `delete:artwork:own` : `delete:artwork:any`,
	)

	return (
		<FooterContainer>
			<FooterTimestamp>{data.timeAgo} ago</FooterTimestamp>
			<FooterActions>
				{canDelete ? <DeletePermission id={artwork.id} /> : null}
				<FooterLinkButton to="edit" icon="pencil-1">
					Edit
				</FooterLinkButton>
				<FooterLinkButton
					to={`/sketch/projects/${artwork.project.slug}/artworks/${artwork.slug}`}
					icon="magic-wand"
				>
					Sketch
				</FooterLinkButton>
			</FooterActions>
		</FooterContainer>
	)
}
