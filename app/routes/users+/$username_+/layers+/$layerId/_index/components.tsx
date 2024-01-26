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
import { Appearances } from './appearances'
import { DeletePermission } from './delete-form'
import { type loader } from './route'

export const Header = () => {
	const data = useLoaderData<typeof loader>()
	return <ContainerHeader>{data.layer.name}</ContainerHeader>
}

export const Content = () => {
	const data = useLoaderData<typeof loader>()
	const user = useOptionalUser()
	const isOwner = user?.id === data.layer.ownerId
	const canDelete = userHasPermission(
		user,
		isOwner ? `delete:layer:own` : `delete:layer:any`,
	)
	const displayBar = canDelete || isOwner
	return (
		<ContainerContent displayBar={displayBar}>
			{/* <ul className="flex flex-wrap gap-5 py-5">
					{data.layer.images.map(image => (
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
			<ContainerP>{data.layer.description}</ContainerP>
			<Separator className="my-4" />
			<Appearances />
		</ContainerContent>
	)
}

export const Footer = () => {
	const data = useLoaderData<typeof loader>()
	const user = useOptionalUser()
	const isOwner = user?.id === data.layer.ownerId
	const canDelete = userHasPermission(
		user,
		isOwner ? `delete:layer:own` : `delete:layer:any`,
	)

	return (
		<FooterContainer>
			<FooterTimestamp>{data.timeAgo} ago</FooterTimestamp>
			<FooterActions>
				{canDelete ? <DeletePermission id={data.layer.id} /> : null}
				<FooterLinkButton to="edit" icon="pencil-1">
					Edit
				</FooterLinkButton>
			</FooterActions>
		</FooterContainer>
	)
}
