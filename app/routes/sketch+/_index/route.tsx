import { redirect, type LoaderFunctionArgs } from '@remix-run/node'

// no artboards list view from sketch
export async function loader({ params, request }: LoaderFunctionArgs) {
	return redirect('/sketch/artboards')
}
