import { type MetaFunction } from '@remix-run/node'
import {
	ContentBody,
	ContentContact,
	ContentHeader,
	ContentLogo,
} from './components/content.tsx'
import { Logos } from './components/logos.tsx'

export const meta: MetaFunction = () => [{ title: 'Epic Notes' }]

export default function Index() {
	return (
		<main className="font-poppins grid h-full place-items-center">
			<div className="grid place-items-center px-4 py-16 xl:grid-cols-2 xl:gap-24">
				<div className="flex max-w-md flex-col items-center text-center xl:order-2 xl:items-start xl:text-left">
					<ContentLogo />
					<ContentHeader />
					<ContentBody />
					<ContentContact />
				</div>
				<Logos />
			</div>
		</main>
	)
}
