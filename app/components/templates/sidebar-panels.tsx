import {
	Panel,
	PanelRow,
	PanelRowActionsContainer,
	PanelRowContainer,
	PanelRowReorderContainer,
	PanelRowValuesContainer,
	PanelTitle,
} from '../layout'

const SidebarPanel = ({ children }: { children: React.ReactNode }) => {
	return <Panel>{children}</Panel>
}

const SidebarPanelHeader = ({
	title,
	children,
}: {
	title: string
	children: React.ReactNode
}) => {
	return (
		<SidebarPanelRow>
			<PanelRowContainer>
				<PanelTitle>{title}</PanelTitle>
				{children}
			</PanelRowContainer>
		</SidebarPanelRow>
	)
}

const SidebarPanelRow = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return <PanelRow className={className}>{children}</PanelRow>
}

const SidebarPanelRowContainer = ({
	children,
}: {
	children: React.ReactNode
}) => {
	return <PanelRowContainer>{children}</PanelRowContainer>
}

const SidebarPanelRowReorderContainer = ({
	children,
}: {
	children: React.ReactNode
}) => {
	return <PanelRowReorderContainer>{children}</PanelRowReorderContainer>
}

const SidebarPanelRowValuesContainer = ({
	children,
}: {
	children: React.ReactNode
}) => {
	return <PanelRowValuesContainer>{children}</PanelRowValuesContainer>
}

const SidebarPanelRowActionsContainer = ({
	children,
}: {
	children: React.ReactNode
}) => {
	return <PanelRowActionsContainer>{children}</PanelRowActionsContainer>
}

export {
	SidebarPanel,
	SidebarPanelRow,
	SidebarPanelRowContainer,
	SidebarPanelHeader,
	SidebarPanelRowReorderContainer,
	SidebarPanelRowValuesContainer,
	SidebarPanelRowActionsContainer,
}
