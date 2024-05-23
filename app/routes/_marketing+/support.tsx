import { redirect } from '@remix-run/react'

export async function loader() {
	return redirect('/')
}

export default function SupportRoute() {
	return <div>Support</div>
}
