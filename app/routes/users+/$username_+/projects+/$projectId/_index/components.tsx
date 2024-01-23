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
import { Artboards } from './artboards'
import { DeletePermission } from './delete-project-form'
import { type loader } from './route'

export const Header = () => {
	const data = useLoaderData<typeof loader>()
	return <ContainerHeader>{data.project.name}</ContainerHeader>
}

export const Content = () => {
	const data = useLoaderData<typeof loader>()
	const user = useOptionalUser()
	const isOwner = user?.id === data.project.ownerId
	const canDelete = userHasPermission(
		user,
		isOwner ? `delete:project:own` : `delete:project:any`,
	)
	const displayBar = canDelete || isOwner
	return (
		<ContainerContent displayBar={displayBar}>
			{/* <ul className="flex flex-wrap gap-5 py-5">
					{data.project.images.map(image => (
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
			<ContainerP>Visible: {data.project.isVisible ? 'Yes' : 'No'}</ContainerP>
			<ContainerP>{data.project.description}</ContainerP>
			<Separator className="my-4" />
			<Artboards />
		</ContainerContent>
	)
}

export const Footer = () => {
	const data = useLoaderData<typeof loader>()
	const user = useOptionalUser()
	const isOwner = user?.id === data.project.ownerId
	const canDelete = userHasPermission(
		user,
		isOwner ? `delete:project:own` : `delete:project:any`,
	)

	return (
		<FooterContainer>
			<FooterTimestamp>{data.timeAgo} ago</FooterTimestamp>
			<FooterActions>
				{canDelete ? <DeletePermission id={data.project.id} /> : null}
				<FooterLinkButton to="edit" icon="pencil-1">
					Edit
				</FooterLinkButton>
			</FooterActions>
		</FooterContainer>
	)
}
