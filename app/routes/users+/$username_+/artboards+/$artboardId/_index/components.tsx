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
import { Separator } from '#app/components/ui/separator'
import { userHasPermission } from '#app/utils/permissions'
import { useOptionalUser } from '#app/utils/user'
import { DeletePermission } from './delete-artboard-form'
import { type loader } from './route'

export const Header = () => {
	const data = useLoaderData<typeof loader>()
	return <ContainerHeader>{data.artboard.name}</ContainerHeader>
}

export const Content = () => {
	const data = useLoaderData<typeof loader>()
	const artboard = data.artboard
	const user = useOptionalUser()
	const isOwner = user?.id === artboard.ownerId
	const canDelete = userHasPermission(
		user,
		isOwner ? `delete:artboard:own` : `delete:artboard:any`,
	)
	const displayBar = canDelete || isOwner
	return (
		<ContainerContent displayBar={displayBar}>
			<ContainerP>Visible: {artboard.isVisible ? 'Yes' : 'No'}</ContainerP>
			<ContainerP>{artboard.description}</ContainerP>
			<ContainerP>
				{artboard.width}x{artboard.height}
			</ContainerP>
			<Separator className="my-4" />
		</ContainerContent>
	)
}

export const Footer = () => {
	const data = useLoaderData<typeof loader>()
	const artboard = data.artboard
	const user = useOptionalUser()
	const isOwner = user?.id === artboard.ownerId
	const canDelete = userHasPermission(
		user,
		isOwner ? `delete:artboard:own` : `delete:artboard:any`,
	)

	return (
		<FooterContainer>
			<FooterTimestamp>{data.timeAgo} ago</FooterTimestamp>
			<FooterActions>
				{canDelete ? <DeletePermission id={artboard.id} /> : null}
				<FooterLinkButton to="edit" icon="pencil-1">
					Edit
				</FooterLinkButton>
			</FooterActions>
		</FooterContainer>
	)
}
