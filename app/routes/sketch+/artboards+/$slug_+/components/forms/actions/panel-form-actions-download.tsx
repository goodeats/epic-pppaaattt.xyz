import { useFetcher } from '@remix-run/react'
import { type FormEvent } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Button } from '#app/components/ui/button'
import { downloadCanvasToImg } from '#app/utils/download'
import { type action } from '../../../route'

export const PanelFormActionsDownload = ({}: {}) => {
	const fetcher = useFetcher<typeof action>()

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const canvas = document.getElementById('canvas-editor') as HTMLCanvasElement
		downloadCanvasToImg({ canvas })
	}

	return (
		<fetcher.Form method="POST" onSubmit={e => handleSubmit(e)}>
			<AuthenticityTokenInput />

			<div className="flex w-full items-center space-x-2">
				<Button type="submit">Download</Button>
			</div>
		</fetcher.Form>
	)
}
