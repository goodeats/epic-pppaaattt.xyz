import { redirect } from '@remix-run/react'

export async function loader() {
	return redirect('/')
}

export default function AboutRoute() {
	return <div>About page</div>
}
