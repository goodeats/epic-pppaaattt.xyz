// usage: for debugging breakpoints for tailwind classes
// let isHydrated = useHydrated()
// if (isHydrated) logTailwindBreakpoints()
// ! make sure to remove this when done debugging
// https://tailwindcss.com/docs/screens
export const logTailwindBreakpoints = () => {
	const screenWidth = window.innerWidth
	console.log('Current Screen Width:', screenWidth + 'px')

	if (screenWidth < 640) {
		console.log('Current Breakpoint: Below SM')
	} else if (screenWidth >= 640 && screenWidth < 768) {
		console.log('Current Breakpoint: SM')
	} else if (screenWidth >= 768 && screenWidth < 1024) {
		console.log('Current Breakpoint: MD')
	} else if (screenWidth >= 1024 && screenWidth < 1280) {
		console.log('Current Breakpoint: LG')
	} else if (screenWidth >= 1280 && screenWidth < 1536) {
		console.log('Current Breakpoint: XL')
	} else {
		console.log('Current Breakpoint: 2XL')
	}

	return null
}
