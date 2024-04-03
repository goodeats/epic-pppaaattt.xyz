import * as React from 'react'
import { colorInvertHexcode } from '#app/utils/colors.ts'
import { cn } from '#app/utils/misc.tsx'
import { Button, type ButtonProps } from './button.tsx'
import { Icon, type IconName } from './icon.tsx'

export const PanelIconButton = React.forwardRef<
	HTMLButtonElement,
	ButtonProps & {
		type?: 'button' | 'submit' | 'reset'
		iconName: IconName
		iconText?: string | null
		backgroundColor?: string
	}
>(
	(
		{
			type = 'button',
			iconName,
			iconText,
			backgroundColor,
			className,
			children,
			...props
		},
		ref,
	) => {
		// if backgroundColor is defined, set the background color and the text color inverted
		const style = backgroundColor
			? {
					backgroundColor: `#${backgroundColor}`,
					color: `#${colorInvertHexcode(backgroundColor)}`,
			  }
			: {}

		return (
			<Button
				ref={ref}
				type={type}
				variant="ghost"
				size="panel"
				className={cn(
					'm-2 mr-0 flex cursor-pointer items-center justify-center',
					className,
				)}
				style={style}
				{...props}
			>
				<Icon name={iconName}>
					<span className="sr-only">{iconText}</span>
				</Icon>
			</Button>
		)
	},
)
PanelIconButton.displayName = 'Button'
