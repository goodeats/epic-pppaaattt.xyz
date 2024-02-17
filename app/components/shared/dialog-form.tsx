import { cn } from '#app/utils/misc'

const DialogFormBody = ({ children }: { children: React.ReactNode }) => {
	return <div className="grid gap-4 py-4">{children}</div>
}

const DialogFormFieldsContainer = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<div className={cn('grid grid-cols-4 items-center gap-4', className)}>
			{children}
		</div>
	)
}

export { DialogFormBody, DialogFormFieldsContainer }
