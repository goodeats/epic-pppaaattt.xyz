import { z } from 'zod'

type FormDataWithId = {
	id?: string
	file?: File
	name?: string
	altText?: string
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
			...fileData,
		}
	} else {
		return z.NEVER
	}
}

function getImageUpdateData(
	data: FormDataWithId,
	fileData?: { contentType: string; blob: Buffer },
) {
	return {
		id: data.id,
		name: data.name,
		altText: data.altText,
		...(fileData && fileData),
	}
}

async function transformFileData(file: File) {
	return {
		contentType: file.type as string,
		blob: Buffer.from(await file.arrayBuffer()),
	}
}
