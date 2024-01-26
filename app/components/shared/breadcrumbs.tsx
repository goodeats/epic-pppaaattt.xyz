const BreadcrumbsContainer = ({ children }: { children: React.ReactNode }) => {
	return <div className="container relative pb-1 pt-5">{children}</div>
}

const BreadcrumbsList = ({ children }: { children: React.ReactNode }) => {
	return <ul className="flex gap-3">{children}</ul>
}

const BreadcrumbListItem = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return <li className={className}>{children}</li>
}

export { BreadcrumbsContainer, BreadcrumbsList, BreadcrumbListItem }
