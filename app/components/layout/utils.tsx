import React, { useId } from 'react'
import { cn } from '#app/utils/misc'

// component factory
//
// This function, createContainerComponent, is a factory function that generates React components.
// It takes an options object as an argument, which can specify a default tag name and a default class name for the generated component.
// The returned component (Component) accepts various props, including id, children, className, and any other props.
// If an id is not provided, it generates a unique id using the randomId function.
// The component uses the provided tagName or the defaultTagName from options as the element type.
// It combines the defaultClassName from options and any className provided via props to form the final className for the element.
// The component then renders the specified tag (or 'div' by default) with the computed properties and children.
// This pattern allows for the creation of multiple container components with different default settings (tag, className) while sharing the same base functionality.

interface ContainerComponentProps {
	id?: string
	children?: React.ReactNode
	className?: string
	[propName: string]: any
}

interface CreateContainerComponentOptions {
	defaultTagName?: keyof JSX.IntrinsicElements
	defaultClassName?: string
	displayName: string
}

const createContainerComponent = ({
	defaultTagName = 'div',
	defaultClassName = '',
	displayName = '',
}: CreateContainerComponentOptions) => {
	const Component = ({
		id,
		children,
		className,
		...props
	}: ContainerComponentProps) => {
		const fallbackId = useId()
		const ComponentId = id || `${displayName}-${fallbackId}`
		const TagName = props.tagName || defaultTagName
		const ComponentProps = {
			id: ComponentId,
			className: cn(defaultClassName, className),
			...props,
		}
		return React.createElement(TagName, ComponentProps, children)
	}
	Component.displayName = `ContainerComponent(${displayName})`
	return Component
}

export { createContainerComponent }
