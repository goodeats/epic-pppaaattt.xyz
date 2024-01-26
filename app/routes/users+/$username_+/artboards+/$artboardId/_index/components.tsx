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
import { type loader } from './route'

export const Header = () => {
	const data = useLoaderData<typeof loader>()
	return <ContainerHeader>{data.artboard.name}</ContainerHeader>
}

export const Content = () => {
	const data = useLoaderData<typeof loader>()
	const user = useOptionalUser()
	const isOwner = user?.id === data.artboard.ownerId
	const canDelete = userHasPermission(
		user,
		isOwner ? `delete:artboard:own` : `delete:artboard:any`,
	)
	const displayBar = canDelete || isOwner
	return (
		<ContainerContent displayBar={displayBar}>
			{/* <ul className="flex flex-wrap gap-5 py-5">
					{data.artboard.images.map(image => (
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
			<ContainerP>Visible: {data.artboard.isVisible ? 'Yes' : 'No'}</ContainerP>
			<ContainerP>{data.artboard.description}</ContainerP>
			<Separator className="my-4" />
		</ContainerContent>
	)
}

export const Footer = () => {
	const data = useLoaderData<typeof loader>()
	// const user = useOptionalUser()
	// const isOwner = user?.id === data.artboard.ownerId
	// const canDelete = userHasPermission(
	// 	user,
	// 	isOwner ? `delete:artboard:own` : `delete:artboard:any`,
	// )

	return (
		<FooterContainer>
			<FooterTimestamp>{data.timeAgo} ago</FooterTimestamp>
			<FooterActions>
				{/* {canDelete ? <DeletePermission id={data.artboard.id} /> : null} */}
				<FooterLinkButton to="edit" icon="pencil-1">
					Edit
				</FooterLinkButton>
			</FooterActions>
		</FooterContainer>
	)
}
