const ContainerIndex = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="container pt-12">
			<p className="text-body-md">{children}</p>
		</div>
	)
}

const ContainerDetails = ({ children }: { children: React.ReactNode }) => {
	return <div className="inset-0 flex flex-1 flex-col px-10">{children}</div>
}

const ContainerHeader = ({ children }: { children: React.ReactNode }) => {
	return <h2 className="mb-2 pt-4 text-h2 lg:mb-6">{children}</h2>
}

const ContainerContent = ({
	children,
	displayBar,
}: {
	children: React.ReactNode
	displayBar: boolean
}) => {
	return (
		<div className={`${displayBar ? 'pb-24' : 'pb-12'} overflow-y-auto`}>
			{children}
		</div>
	)
}

const ContainerP = ({ children }: { children: React.ReactNode }) => {
	return (
		<p className="whitespace-break-spaces text-sm md:text-lg">{children}</p>
	)
}

export {
	ContainerIndex,
	ContainerDetails,
	ContainerHeader,
	ContainerContent,
	ContainerP,
}
