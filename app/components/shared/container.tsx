const ContainerIndex = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="container pt-12">
			<p className="text-body-md">{children}</p>
		</div>
	)
}

export { ContainerIndex }
