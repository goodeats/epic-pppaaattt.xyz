import { type MetaFunction } from '@remix-run/node'
import {
	ContentBody,
	ContentContact,
	ContentHeader,
	ContentLogo,
} from './components/content.tsx'
import { ImagesGrid } from './components/images-grid.tsx'

export const meta: MetaFunction = () => [{ title: 'PPPAAATTT' }]

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
