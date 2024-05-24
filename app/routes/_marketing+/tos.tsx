import { redirect } from '@remix-run/react'

export async function loader() {
	return redirect('/')
}

export default function TermsOfServiceRoute() {
	return <div>Terms of service</div>
}
