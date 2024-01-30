import { useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import { useActionData, useFetcher, useLoaderData } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { ErrorList } from '#app/components/forms'
import {
	FormDownloadIcon,
	formDeleteButtonDefaultClassName,
} from '#app/components/shared'
import { StatusButton } from '#app/components/ui/status-button'
import { downloadCanvasAsPNG } from '#app/utils/download'
import { useIsPending } from '#app/utils/misc'
import { DownloadArtboardCanvasSchema, INTENT } from './actions'
import { type loader, type action } from './route'

export function DownloadForm() {
	const data = useLoaderData<typeof loader>()
	const { artboard } = data

	const fetcher = useFetcher()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form] = useForm({
		id: 'download-artboard-canvas',
		lastSubmission: actionData?.submission,
		onSubmit: (event, { formData }) => {
			event.preventDefault()

			const submission = parse(formData, {
				schema: DownloadArtboardCanvasSchema,
			})
			if (!submission.value) {
				console.warn('no submission', submission)
				return
			}

			downloadCanvasAsPNG()

			fetcher.submit(formData, {
				method: 'POST',
			})
		},
	})

	if (!artboard) return null

	return (
		<fetcher.Form method="POST" {...form.props}>
			<AuthenticityTokenInput />
			<input type="hidden" name="artboardId" value={artboard.id} />
			<StatusButton
				type="submit"
				name="intent"
				value={INTENT.downloadArtboardCanvas}
				variant="secondary"
				status={isPending ? 'pending' : actionData?.status ?? 'idle'}
				disabled={isPending}
				className={formDeleteButtonDefaultClassName}
			>
				<FormDownloadIcon />
			</StatusButton>
			<ErrorList errors={form.errors} id={form.errorId} />
		</fetcher.Form>
	)
}
