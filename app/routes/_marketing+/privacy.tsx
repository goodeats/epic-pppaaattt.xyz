import { redirect } from '@remix-run/react'

export async function loader() {
	return redirect('/')
}

export default function PrivacyRoute() {
	return <div>Privacy</div>
}
