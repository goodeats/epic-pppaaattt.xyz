import { parse } from '@conform-to/zod'
import { json } from '@remix-run/node'
import { z } from 'zod'

export const INTENT = {
	downloadArtboardCanvas: 'download-artboard-canvas' as const,
}

type EditorActionArgs = {
	request: Request
	userId: string
	formData: FormData
}

export const DownloadArtboardCanvasSchema = z.object({
	artboardId: z.string(),
})

export async function downloadArtboardCanvasAction({
	formData,
}: EditorActionArgs) {
	console.log('DOWNLOAD ACTION')
	const submission = await parse(formData, {
		schema: DownloadArtboardCanvasSchema,
	})
	if (submission.intent !== 'submit') {
		return json({ status: 'idle', submission } as const)
	}
	if (!submission.value) {
		return json({ status: 'error', submission } as const, { status: 400 })
	}

	// TODO: consider saving artboard to an image, along with json

	return json({ status: 'success', submission } as const)
}
