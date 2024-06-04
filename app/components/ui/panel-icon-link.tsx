import { Link } from '@remix-run/react'
import * as React from 'react'
import { colorInvertHexcode } from '#app/utils/colors.ts'
import { cn } from '#app/utils/misc.tsx'
import { Button, type ButtonProps } from './button.tsx'
import { Icon, type IconName } from './icon.tsx'

export const PanelIconLink = React.forwardRef<
	HTMLButtonElement,
	ButtonProps & {
		type?: 'button' | 'submit' | 'reset'
		to: string
		iconName: IconName
		iconText?: string | null
		size?: 'panel' | 'panel-sm'
		backgroundColor?: string | null | undefined
	}
>(
	(
		{
			type = 'button',
			to,
			iconName,
			iconText,
			size = 'panel',
			backgroundColor,
			className,
			children,
			...props
		},
		ref,
	) => {
		// if backgroundColor is defined, set the background color
		// and the text color inverted so the icon is visible
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
				size={size}
				className={cn(
					'm-2 mx-0 flex cursor-pointer items-center justify-center',
					'border border-accent hover:border-accent-foreground focus:border-accent-foreground',
					className,
				)}
				style={style}
				{...props}
				asChild
			>
				<Link to={to} prefetch="intent">
					<Icon name={iconName}>
						<span className="sr-only">{iconText}</span>
					</Icon>
				</Link>
			</Button>
		)
	},
)
PanelIconLink.displayName = 'Button'
