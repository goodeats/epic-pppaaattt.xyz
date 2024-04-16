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

const DashboardCardWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex flex-col flex-wrap gap-2 md:flex-row">{children}</div>
	)
}

// placeholder for when cards list is empty
// i.e., "No projects found"
const DashboardCardNone = ({ children }: { children: React.ReactNode }) => (
	<div className="mb-2 flex w-80 flex-1 items-center justify-center lg:mb-6">
		<h4 className="text-h4">{children}</h4>
	</div>
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
	return (
		<Card className="mb-2 w-80 lg:mb-6">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			{children}
		</Card>
	)
}

// currently just one line of text truncated (...)
// create variant(s) for additional, more complex content
const DashboardCardContent = ({ children }: { children: React.ReactNode }) => {
	return (
		<CardContent>
			<div className="space-y-4 truncate">{children}</div>
		</CardContent>
	)
}

// full width buttons, links, etc.
const DashboardCardFooter = ({ children }: { children: React.ReactNode }) => {
	return (
		<CardFooter className="flex gap-2 border-t px-6 py-4">
			{children}
		</CardFooter>
	)
}

// button does not shrink on smaller screens, or to icon square
// card will never be squished on smaller screens
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
			<Link to={to}>
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
