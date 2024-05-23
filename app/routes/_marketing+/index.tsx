import { invariantResponse } from '@epic-web/invariant'
import {
	type LoaderFunctionArgs,
	json,
	type MetaFunction,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import {
	MarketingContentSection,
	MarketingDetailsSection,
	MarketingLogoImage,
	MarketingLogoLink,
	MarketingMainLayout,
} from '#app/components/layout/marketing.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { getUserImgSrc } from '#app/utils/misc.tsx'
import {
	ContentBody,
	ContentContact,
	ContentHeader,
} from './components/content.tsx'
import { ImagesGrid } from './components/images-grid.tsx'

export async function loader({ params, request }: LoaderFunctionArgs) {
	const user = await await prisma.user.findFirst({
		select: {
			name: true,
			username: true,
			bio: true,
			sm_url_instagram: true,
			sm_url_github: true,
			image: { select: { id: true } },
		},
	})
	invariantResponse(user, 'Nothing to show today', { status: 404 })

	return json({
		user,
	})
}

export default function Index() {
	const data = useLoaderData<typeof loader>()
	const { user } = data
	console.log(user)

	return (
		<MarketingMainLayout>
			<MarketingContentSection>
				<MarketingDetailsSection>
					<MarketingLogoLink
						href="https://github.com/goodeats/epic-pppaaattt.xyz"
						target="_blank"
						rel="noopener noreferrer"
					>
						<MarketingLogoImage
							alt="Pat Needham"
							src={getUserImgSrc(user.image?.id)}
						/>
					</MarketingLogoLink>
					<ContentHeader />
					<ContentBody bio={user.bio} />
					<ContentContact ig={user.sm_url_instagram} gh={user.sm_url_github} />
				</MarketingDetailsSection>
				<ImagesGrid />
			</MarketingContentSection>
		</MarketingMainLayout>
	)
}

export const meta: MetaFunction = () => {
	const title = 'PPPAAATTT'
	const titleElements = [
		{ title: 'PPPAAATTT | Home' },
		{ property: 'og:title', content: title },
		{ property: 'twitter:title', content: title },
	]

	const description =
		'Welcome to my digital gallery of generative art built with triangles and algorithms.'
	const descriptionElements = [
		{
			name: 'description',
			content: description,
		},
		{
			property: 'og:description',
			content: description,
		},
		{
			property: 'twitter:description',
			content: description,
		},
	]

	const imageUrl = 'https://pppaaattt.xyz/images/0.png'
	const imageElements = [
		{ property: 'og:image', content: imageUrl },
		{ property: 'twitter:image', content: imageUrl },
		{ name: 'twitter:card', content: 'summary_large_image' },
	]

	const twitterElements = [
		{ name: 'twitter:site', content: '@pppaaattt_xyz' },
		{ name: 'twitter:creator', content: '@pppaaattt_xyz' },
	]

	return [
		...titleElements,
		...descriptionElements,
		...imageElements,
		...twitterElements,
		{ property: 'og:type', content: 'website' },
		{ property: 'og:url', content: 'https://pppaaattt.xyz' },
		{
			name: 'keywords',
			content:
				'generative art, digital gallery, triangles, algorithms, art, digital art, pppaaattt',
		},
	]
}
