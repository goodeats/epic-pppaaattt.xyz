import { type Appearance } from '@prisma/client'
import {
	type AppearanceValuesMap,
	type AppearanceType,
} from '#app/utils/appearances'
import { validateStringIsHexcode } from '#app/utils/colors'
import { cn } from '#app/utils/misc'

export const PanelRowIndicator = ({
	appearance,
	appearanceType,
}: {
	appearance: Pick<Appearance, 'id' | 'value'>
	appearanceType: AppearanceType
}) => {
	const value = JSON.parse(
		appearance.value,
	) as AppearanceValuesMap[typeof appearanceType]

	const vvalue = value.value
	const backgroundColor =
		typeof vvalue === 'string' && validateStringIsHexcode(vvalue)
			? `#${vvalue}`
			: '#FFFFFF'

	return (
		<div>
			<div
				className={cn('relative m-2 mr-0 h-4 w-4 overflow-hidden')}
				style={{ backgroundColor }}
			></div>
		</div>
	)
}
