import { useForm } from '@conform-to/react'
import { useActionData, useFetcher, useLoaderData } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { ErrorList } from '#app/components/forms'
import {
	FormDownloadIcon,
	formDeleteButtonDefaultClassName,
} from '#app/components/shared'
import { StatusButton } from '#app/components/ui/status-button'
import { useIsPending } from '#app/utils/misc'
import { INTENT } from './actions'
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
