import { cn } from '#app/utils/misc'

const MainContainer = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="container flex h-full min-h-[400px] px-0 pb-12 md:px-8">
			{children}
		</main>
	)
}

const ContentWrapper = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<div
			className={cn(
				'grid w-full grid-cols-4 bg-muted pl-2 md:container md:rounded-3xl md:pr-0',
				className,
			)}
		>
			{children}
		</div>
	)
}

const MainContent = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<div
			className={cn(
				'relative col-span-3 flex flex-col bg-accent md:rounded-r-3xl',
				className,
			)}
		>
			{children}
		</div>
	)
}

const ContentHeader = ({
	children,
	title,
	className,
}: {
	children: React.ReactNode
	title?: string | React.ReactNode
	className?: string
}) => {
	const ContentHeaderTitle = () => {
		if (typeof title === 'string') {
			return (
				<h1 className="w-full text-lg font-semibold tracking-tight">{title}</h1>
			)
		}

		return title
	}

	return (
		<div
			className={cn(
				'container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16',
				className,
			)}
		>
			{title && <ContentHeaderTitle />}
			{children}
		</div>
	)
}

const ContentHeaderActions = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<div
			className={cn('ml-auto flex w-full space-x-2 sm:justify-end', className)}
		>
			{children}
		</div>
	)
}

export {
	MainContainer,
	ContentWrapper,
	MainContent,
	ContentHeader,
	ContentHeaderActions,
}
