import { invariantResponse } from '@epic-web/invariant'
import {
	type LoaderFunctionArgs,
	json,
	type MetaFunction,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import {
	MarketingContentSection,
	MarketingMainLayout,
} from '#app/components/layout/marketing.tsx'
import { type IArtworkVersionGenerator } from '#app/definitions/artwork-generator.ts'
import { getAllPublishedArtworkVersions } from '#app/models/artwork-version/artwork-version.get.server.ts'
import {
	type IArtworkVersionWithChildren,
	type IArtworkVersionWithGenerator,
} from '#app/models/artwork-version/artwork-version.server.ts'
import { artworkVersionGeneratorBuildService } from '#app/services/artwork/version/generator/build.service.ts'
import { prisma } from '#app/utils/db.server.ts'
import { CanvasGrid } from './components/canvas-grid.tsx'
import { UserDetails } from './components/user-details.tsx'

export interface IUserMarketing {
	name: string | null
	username: string
	bio: string
	sm_url_instagram: string | null
	sm_url_github: string | null
	image: { id: string | null } | null
}

export async function loader({ params, request }: LoaderFunctionArgs) {
	const user: IUserMarketing | null = await prisma.user.findFirst({
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

	// get all starred versions
	// will eventually want to limit by user, but just one for now
	const publishedVersions: IArtworkVersionWithChildren[] =
		await getAllPublishedArtworkVersions()

	// get all generators for these versions
	const generators: IArtworkVersionGenerator[] = await Promise.all(
		publishedVersions.map(version =>
			artworkVersionGeneratorBuildService({ version }),
		),
	)

	// combine versions and generators
	const versionsWithGenerators: IArtworkVersionWithGenerator[] =
		publishedVersions.map((version, index) => ({
			...version,
			generator: generators[index],
		}))

	return json({
		user,
		versionsWithGenerators,
	})
}

export default function Index() {
	const data = useLoaderData<typeof loader>()
	const { user } = data

	return (
		<MarketingMainLayout>
			<MarketingContentSection className="xl:grid-cols-1">
				<UserDetails user={user} />
			</MarketingContentSection>
			<CanvasGrid versions={data.versionsWithGenerators} />
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
