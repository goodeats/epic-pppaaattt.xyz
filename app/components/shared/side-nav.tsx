import { Link } from '@remix-run/react'

const SideNavWrapper = ({ children }: { children: React.ReactNode }) => {
	return <div className="relative col-span-1 flex flex-col">{children}</div>
}

const SideNavContainer = ({ children }: { children?: React.ReactNode }) => {
	return (
		<div className="absolute inset-0 flex flex-col overflow-y-auto overflow-x-hidden">
			{children}
		</div>
	)
}

const SideNavHeaderLink = ({
	children,
	to,
}: {
	children: React.ReactNode
	to: string
}) => {
	return (
		<Link
			to={to}
			className="flex flex-col items-center justify-center gap-2 bg-muted pb-4 pl-8 pr-4 pt-12 lg:flex-row lg:justify-start lg:gap-4"
		>
			{children}
		</Link>
	)
}

const SideNavHeaderImage = ({ src, alt }: { src: string; alt: string }) => {
	return (
		<img
			src={src}
			alt={alt}
			className="h-16 w-16 rounded-full object-cover lg:h-24 lg:w-24"
		/>
	)
}

const SideNavHeaderTitle = ({ children }: { children: React.ReactNode }) => {
	return (
		<h1 className="text-center text-base font-bold md:text-lg lg:text-left lg:text-2xl">
			{children}
		</h1>
	)
}

const SideNavList = ({ children }: { children: React.ReactNode }) => {
	return <ul className="overflow-y-auto overflow-x-hidden pb-12">{children}</ul>
}

const SideNavListItem = ({ children }: { children: React.ReactNode }) => {
	return <li className="p-1 pr-0">{children}</li>
}

const sideNavLinkDefaultClassName =
	'line-clamp-2 block rounded-l-full py-2 pl-8 pr-6 text-base lg:text-xl'

export {
	SideNavWrapper,
	SideNavContainer,
	SideNavHeaderLink,
	SideNavHeaderImage,
	SideNavHeaderTitle,
	SideNavList,
	SideNavListItem,
	sideNavLinkDefaultClassName,
}
