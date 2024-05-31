import { useState } from 'react'
import { Button } from '#app/components/ui/button'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '#app/components/ui/collapsible'
import { Icon } from '#app/components/ui/icon'
import { cn } from '#app/utils/misc'

export function CollapsibleSidebar({
	children,
}: {
	children: React.ReactNode
}) {
	const [isOpen, setIsOpen] = useState(true)
	const icon = isOpen ? 'caret-left' : 'caret-right'

	return (
		<div
			className={cn(
				'hidden flex-col rounded-md bg-accent p-4 lg:block',
				isOpen && 'w-64',
			)}
		>
			<Collapsible
				open={isOpen}
				onOpenChange={setIsOpen}
				className="relative h-full space-y-2"
			>
				<div className="flex justify-end">
					<CollapsibleTrigger asChild>
						<Button variant="outline" size="sm">
							<Icon name={icon}>
								<span className="sr-only">Toggle</span>
							</Icon>
						</Button>
					</CollapsibleTrigger>
				</div>

				<CollapsibleContent className="h-full space-y-2">
					{children}
				</CollapsibleContent>
			</Collapsible>
		</div>
	)
}
