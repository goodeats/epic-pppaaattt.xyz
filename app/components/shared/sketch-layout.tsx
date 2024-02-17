import { cn } from '#app/utils/misc'

const SketchContainer = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="container flex h-full min-h-[400px] px-0 pb-12 md:px-8">
			{children}
		</main>
	)
}

const SketchWrapper = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<div
			className={cn(
				'flex w-full flex-col bg-muted md:container md:rounded-3xl md:px-0',
				className,
			)}
		>
			{children}
		</div>
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
				'relative flex h-full bg-accent md:rounded-b-3xl',
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
			className={cn(
				'relative flex h-full flex-1 p-4 md:rounded-bl-3xl',
				className,
			)}
		>
			{children}
		</div>
	)
}

export {
	SketchContainer,
	SketchWrapper,
	SketchHeader,
	SketchHeaderTitle,
	SketchHeaderActions,
	SketchBody,
	SketchBodyContent,
}
