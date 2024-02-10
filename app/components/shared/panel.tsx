const Panel = ({ children }: { children: React.ReactNode }) => {
	return <div className="grid w-full border-b-2 py-2">{children}</div>
}

const PanelRow = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="relative  grid h-8 w-full grid-cols-12 grid-rows-1 items-center px-4">
			{children}
		</div>
	)
}

const PanelHeader = ({ children }: { children: React.ReactNode }) => {
	return (
		<PanelRow>
			<div className="col-start-1 col-end-13 flex items-center justify-between">
				{children}
			</div>
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

export { Panel, PanelRow, PanelHeader, PanelTitle }
