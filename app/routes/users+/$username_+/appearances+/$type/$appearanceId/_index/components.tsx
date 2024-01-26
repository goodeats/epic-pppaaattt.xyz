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
import { DeletePermission } from './delete-form'
import { type loader } from './route'

export const Header = () => {
	const data = useLoaderData<typeof loader>()
	return <ContainerHeader>{data.appearance.name}</ContainerHeader>
}

export const Content = () => {
	const data = useLoaderData<typeof loader>()
	const user = useOptionalUser()
	const isOwner = user?.id === data.appearance.ownerId
	const canDelete = userHasPermission(
		user,
		isOwner ? `delete:appearance:own` : `delete:appearance:any`,
	)
	const displayBar = canDelete || isOwner
	return (
		<ContainerContent displayBar={displayBar}>
			{/* <ul className="flex flex-wrap gap-5 py-5">
					{data.appearance.images.map(image => (
						<li key={image.id}>
							<a href={getNoteImgSrc(image.id)}>
								<img
									src={getNoteImgSrc(image.id)}
									alt={image.altText ?? ''}
									className="h-32 w-32 rounded-lg object-cover"
								/>
							</a>
						</li>
					))}
				</ul> */}
			<ContainerP>{data.appearance.description}</ContainerP>
			<ContainerP>{data.appearance.value}</ContainerP>
			<Separator className="my-4" />
		</ContainerContent>
	)
}

export const Footer = () => {
	const data = useLoaderData<typeof loader>()
	const user = useOptionalUser()
	const isOwner = user?.id === data.appearance.ownerId
	const canDelete = userHasPermission(
		user,
		isOwner ? `delete:appearance:own` : `delete:appearance:any`,
	)

	return (
		<FooterContainer>
			<FooterTimestamp>{data.timeAgo} ago</FooterTimestamp>
			<FooterActions>
				{canDelete ? <DeletePermission id={data.appearance.id} /> : null}
				<FooterLinkButton to="edit" icon="pencil-1">
					Edit
				</FooterLinkButton>
			</FooterActions>
		</FooterContainer>
	)
}
