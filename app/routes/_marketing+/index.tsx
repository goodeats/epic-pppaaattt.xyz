import { type MetaFunction } from '@remix-run/node'
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
		<main className="font-poppins grid h-full place-items-center">
			<div className="grid place-items-center px-4 py-16 xl:grid-cols-2 xl:gap-4">
				<div className="mb-4 flex max-w-lg flex-col items-center text-left xl:order-2 xl:mt-16 xl:items-start xl:self-start">
					<ContentLogo />
					<ContentHeader />
					<ContentBody />
					<ContentContact />
				</div>
				<ImagesGrid />
			</div>
		</main>
	)
}
