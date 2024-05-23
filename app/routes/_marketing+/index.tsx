import { type MetaFunction } from '@remix-run/node'
import {
	MarketingContentSection,
	MarketingDetailsSection,
	MarketingMainLayout,
} from '#app/components/layout/marketing.tsx'
import {
	ContentBody,
	ContentContact,
	ContentHeader,
	ContentLogo,
} from './components/content.tsx'
import { ImagesGrid } from './components/images-grid.tsx'

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

export default function Index() {
	return (
		<MarketingMainLayout>
			<MarketingContentSection>
				<MarketingDetailsSection>
					<ContentLogo />
					<ContentHeader />
					<ContentBody />
					<ContentContact />
				</MarketingDetailsSection>
				<ImagesGrid />
			</MarketingContentSection>
		</MarketingMainLayout>
	)
}
