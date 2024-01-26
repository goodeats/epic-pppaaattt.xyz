import { useParams } from '@remix-run/react'
import { ContainerIndex } from '#app/components/shared'
import { transformSlugToTitle } from '#app/utils/string-formatting'

export const Container = () => {
	const params = useParams()
	const { type } = params
	return (
		<ContainerIndex>
			Select a {transformSlugToTitle(type || 'Appearance')}
		</ContainerIndex>
	)
}
