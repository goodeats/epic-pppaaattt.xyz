import ExifReader from 'exifreader'
import { z } from 'zod'
import { type IAssetImageFileData } from '#app/models/asset/image/image.server'

type FormDataWithId = {
	id?: string
	file?: File
	name?: string
	altText?: string
}

interface FileData extends IAssetImageFileData {
	blob: Buffer
}

export async function transformAssetImageData(data: FormDataWithId) {
	return data.id
		? transformAssetImageDataUpdate(data)
		: transformAssetImageDataCreate(data)
}

async function transformAssetImageDataUpdate(data: FormDataWithId) {
	const imageHasFile = Boolean(data.file?.size && data.file?.size > 0)
	if (imageHasFile && data.file) {
		// new image file, update the data and the file
		const fileData = await transformFileData(data.file)
		return getImageUpdateData(data, fileData)
	} else {
		// no new image file, just update the data
		return getImageUpdateData(data)
	}
}

async function transformAssetImageDataCreate(data: FormDataWithId) {
	if (data.file && data.file.size > 0) {
		const fileData = await transformFileData(data.file)
		return {
			...data,
			...(fileData || {}),
		}
	} else {
		return z.NEVER
	}
}

function getImageUpdateData(data: FormDataWithId, fileData?: FileData) {
	return {
		...data,
		...(fileData && fileData),
	}
}

async function transformFileData(file: File): Promise<FileData> {
	const arrayBuffer = await file.arrayBuffer()
	const buffer = Buffer.from(arrayBuffer)

	const metadata = await ExifReader.load(buffer)
	const height = metadata?.['Image Height']?.value ?? 0
	const width = metadata?.['Image Width']?.value ?? 0

	return {
		contentType: file.type,
		blob: buffer,
		height,
		width,
		size: file.size,
		lastModified: file.lastModified,
		filename: file.name,
	}
}
