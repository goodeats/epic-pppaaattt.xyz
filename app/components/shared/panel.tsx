import { cn } from '#app/utils/misc'

const PanelContainer = ({
	children,
	variant,
}: {
	children?: React.ReactNode
	variant?: 'left'
}) => {
	const baseClasses = 'relative w-64 bg-muted py-2'
	const variantClasses =
		variant === 'left'
			? 'border-r-2 md:rounded-bl-3xl'
			: 'border-l-2 md:rounded-br-3xl'
	return <div className={`${baseClasses} ${variantClasses}`}>{children}</div>
}

const Panel = ({ children }: { children: React.ReactNode }) => {
	return <div className="grid w-full border-b-2 py-2">{children}</div>
}

const PanelRow = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<div
			className={cn(
				'relative grid h-8 w-full grid-cols-12 grid-rows-1 items-center px-2',
				className,
			)}
		>
			{children}
		</div>
	)
}

const PanelRowContainer = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="col-start-1 col-end-13 flex items-center justify-between gap-2">
			{children}
		</div>
	)
}

const PanelHeader = ({ children }: { children: React.ReactNode }) => {
	return (
		<PanelRow>
			<PanelRowContainer>{children}</PanelRowContainer>
		</PanelRow>
	)
}

const PanelTitle = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="col-start-1 h-8 w-full self-center overflow-x-hidden pl-2">
			<span className="flex items-center">{children}</span>
		</div>
	)
}

const PanelRowOrderContainer = ({
	children,
}: {
	children: React.ReactNode
}) => {
	return (
		<div className="l-0 t-0 absolute flex h-8 w-4 flex-col items-center justify-center">
			{children}
		</div>
	)
}

const PanelRowValueContainer = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<div className={cn('col-end-8 flex max-w-36 items-center', className)}>
			{children}
		</div>
	)
}

const PanelRowIconContainer = ({ children }: { children: React.ReactNode }) => {
	return <div className="flex flex-shrink-0 items-center">{children}</div>
}

export {
	PanelContainer,
	Panel,
	PanelRow,
	PanelRowContainer,
	PanelHeader,
	PanelTitle,
	PanelRowOrderContainer,
	PanelRowValueContainer,
	PanelRowIconContainer,
}
