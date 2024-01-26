const MainContainer = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="container flex h-full min-h-[400px] px-0 pb-12 md:px-8">
			{children}
		</main>
	)
}

const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="grid w-full grid-cols-4 bg-muted pl-2 md:container md:rounded-3xl md:pr-0">
			{children}
		</div>
	)
}

const MainContent = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="relative col-span-3 flex flex-col bg-accent md:rounded-r-3xl">
			{children}
		</div>
	)
}

export { MainContainer, ContentWrapper, MainContent }
