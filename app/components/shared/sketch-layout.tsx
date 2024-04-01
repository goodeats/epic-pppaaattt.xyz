import { cn } from '#app/utils/misc'

const SketchContainer = ({ children }: { children: React.ReactNode }) => {
	return (
		<main
			id="sketch-container"
			className="flex h-screen w-full flex-col overflow-hidden p-0"
		>
			{children}
		</main>
	)
}

const SketchHeader = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<div
			className={cn(
				'container flex items-start justify-between space-y-2 border-b-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16',
				className,
			)}
		>
			{children}
		</div>
	)
}

const SketchHeaderTitle = ({
	children,
}: {
	children: string | React.ReactNode
}) => {
	return <h1 className="text-lg font-semibold tracking-tight">{children}</h1>
}

const SketchHeaderActions = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<div
			className={cn(
				'ml-auto flex w-full items-center space-x-4 sm:justify-end',
				className,
			)}
		>
			{children}
		</div>
	)
}

const SketchBody = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<div
			className={cn(
				'relative flex flex-1 flex-row border-4 border-yellow-500 bg-accent',
				className,
			)}
		>
			{children}
		</div>
	)
}

const SketchBodyContent = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<div
			id="sketch-body-content"
			className={cn('relative flex-1 border-4 border-red-500 p-4', className)}
		>
			{children}
		</div>
	)
}

export {
	SketchContainer,
	SketchHeader,
	SketchHeaderTitle,
	SketchHeaderActions,
	SketchBody,
	SketchBodyContent,
}
