import { Link } from '@remix-run/react'
import { Button } from '#app/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'
import { Icon, type IconName } from '#app/components/ui/icon'
import { createContainerComponent } from '../utils'

const DashboardCardWrapper = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'flex flex-col flex-wrap gap-2 md:flex-row',
	displayName: 'DashboardCardWrapper',
})

const DashboardCardNoneWrapper = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'mb-2 flex w-80 flex-1 items-center justify-center lg:mb-6',
	displayName: 'DashboardCardNoneWrapper',
})
// placeholder for when cards list is empty
// i.e., "No projects found"
const DashboardCardNone = ({ children }: { children: React.ReactNode }) => (
	<DashboardCardNoneWrapper>
		<h4 className="text-h4">{children}</h4>
	</DashboardCardNoneWrapper>
)

const DashboardCard = ({
	title,
	description,
	children,
}: {
	title: string
	description: string
	children: React.ReactNode
}) => {
	// - fixed width to indicate a smaller card
	// - more space between cards on larger screens
	const className = 'mb-2 w-80 lg:mb-6'

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			{children}
		</Card>
	)
}

const DashboardCardContentSmall = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'space-y-4 truncate',
	displayName: 'DashboardCardContentSmall',
})

// currently just one line of text truncated (...)
// create variant(s) for additional, more complex content
const DashboardCardContent = ({ children }: { children: React.ReactNode }) => {
	return (
		<CardContent>
			<DashboardCardContentSmall>{children}</DashboardCardContentSmall>
		</CardContent>
	)
}

const DashboardCardFooter = ({ children }: { children: React.ReactNode }) => {
	// - full width buttons, links, etc.
	const className = 'flex gap-2 border-t px-6 py-4'
	return <CardFooter className={className}>{children}</CardFooter>
}

// button does not shrink on smaller screens, or to icon square
// card will never be squished on smaller screens
// will take up full width of card footer or split if multiple
const DashboardCardFooterLink = ({
	to,
	icon,
	children,
}: {
	to: string
	icon: IconName
	children: React.ReactNode
}) => {
	return (
		<Button asChild className="flex-1">
			<Link prefetch="intent" to={to}>
				<Icon name={icon}>
					<span>{children}</span>
				</Icon>
			</Link>
		</Button>
	)
}

export {
	DashboardCardWrapper,
	DashboardCardNone,
	DashboardCard,
	DashboardCardContent,
	DashboardCardFooter,
	DashboardCardFooterLink,
}
