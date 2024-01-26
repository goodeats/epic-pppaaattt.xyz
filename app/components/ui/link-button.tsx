import { Link } from '@remix-run/react'
import * as React from 'react'
import { cn } from '#app/utils/misc.tsx'
import { Button } from './button.tsx'

export const LinkButton = ({
	to,
	children,
	variant,
	className,
}: {
	to: string
	children: React.ReactNode
	variant?:
		| 'default'
		| 'destructive'
		| 'outline'
		| 'secondary'
		| 'ghost'
		| 'link'
	className?: string
}) => {
	return (
		<Button asChild className={cn('', className)} variant={variant}>
			<Link to={to}>{children}</Link>
		</Button>
	)
}

LinkButton.displayName = 'Button'
