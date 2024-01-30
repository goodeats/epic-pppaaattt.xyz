import { useForm } from '@conform-to/react'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { ErrorList } from '#app/components/forms'
import {
	FormDownloadIcon,
	formDeleteButtonDefaultClassName,
} from '#app/components/shared'
import { StatusButton } from '#app/components/ui/status-button'
import { useIsPending } from '#app/utils/misc'
import { type action } from './route'

export function DownloadForm() {
	const fetcher = useFetcher()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form] = useForm({
		id: 'download-artboard-canvas',
		lastSubmission: actionData?.submission,
	})

	return (
		<fetcher.Form method="POST" {...form.props}>
			<AuthenticityTokenInput />
			<input type="hidden" name="artboardId" value={'downloadId'} />
			<StatusButton
				type="submit"
				name="intent"
				value="downloading-artboard-canvas"
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
