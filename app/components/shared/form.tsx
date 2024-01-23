import { floatingToolbarClassName } from '../floating-toolbar'

const FormContainer = ({ children }: { children: React.ReactNode }) => {
	return <div className="absolute inset-0">{children}</div>
}

const formDefaultClassName =
	'flex h-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden px-10 pb-28 pt-12'

const FormFieldsContainer = ({ children }: { children: React.ReactNode }) => {
	return <div className="flex flex-col gap-1">{children}</div>
}

const FormActionsContainer = ({ children }: { children: React.ReactNode }) => {
	return <div className={floatingToolbarClassName}>{children}</div>
}

export {
	FormContainer,
	FormFieldsContainer,
	FormActionsContainer,
	formDefaultClassName,
}
