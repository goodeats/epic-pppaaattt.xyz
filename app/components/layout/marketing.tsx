import { cn } from '#app/utils/misc'
import { createContainerComponent } from './utils'

const MarketingMainLayout = createContainerComponent({
	defaultTagName: 'main',
	defaultClassName: 'font-poppins grid h-full place-items-center',
	displayName: 'MarketingMainLayout',
})

const MarketingContentSection = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName:
		'grid place-items-center px-4 py-16 xl:grid-cols-2 xl:gap-4',
	displayName: 'MarketingContentSection',
})

const MarketingDetailsSection = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName:
		'mb-4 flex max-w-lg flex-col items-center text-left xl:order-2 xl:mt-16 xl:items-start xl:self-start',
	displayName: 'MarketingDetailsSection',
})

const MarketingLogoLink = createContainerComponent({
	defaultTagName: 'a',
	defaultClassName:
		'animate-slide-top [animation-fill-mode:backwards] xl:animate-slide-left xl:[animation-delay:0.5s] xl:[animation-fill-mode:backwards]',
	displayName: 'MarketingLogoLink',
})

const MarketingLogoImage = createContainerComponent({
	defaultTagName: 'img',
	defaultClassName: 'h-52 w-52 rounded-full object-cover',
	displayName: 'MarketingLogoImage',
})

const MarketingHeader = createContainerComponent({
	defaultTagName: 'h1',
	defaultClassName:
		'mt-8 animate-slide-top text-4xl font-medium text-foreground [animation-delay:0.3s] [animation-fill-mode:backwards] md:text-5xl xl:mt-4 xl:animate-slide-left xl:text-6xl xl:[animation-delay:0.8s] xl:[animation-fill-mode:backwards]',
	displayName: 'MarketingHeader',
})

const MarketingContent = createContainerComponent({
	defaultTagName: 'p',
	defaultClassName:
		'mt-6 animate-slide-top text-xl/7 text-muted-foreground [animation-delay:0.8s] [animation-fill-mode:backwards] xl:mt-8 xl:animate-slide-left xl:text-xl/6 xl:leading-10 xl:[animation-delay:1s] xl:[animation-fill-mode:backwards]',
	displayName: 'MarketingContent',
})

const MarketingSocialLinksList = createContainerComponent({
	defaultTagName: 'ul',
	defaultClassName:
		'mt-6 flex animate-slide-top space-x-6 [animation-delay:1.2s] [animation-fill-mode:backwards] xl:mt-8 xl:animate-slide-left xl:[animation-delay:1.2s] xl:[animation-fill-mode:backwards]',
	displayName: 'MarketingSocialLinksList',
})

// experimenting with constructing class names
// separately by category and breakpoint
// possibly more readable and maintainable
const MarketingCanvasGrid = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: cn(
		'mt-16 xl:mt-0',
		'py-16 px-4 lg:px-8 xl:px-16',
		'grid place-items-center',
		'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
		'gap-8',
	),
	displayName: 'MarketingCanvasGrid',
})

export {
	MarketingMainLayout,
	MarketingContentSection,
	MarketingDetailsSection,
	MarketingLogoLink,
	MarketingLogoImage,
	MarketingHeader,
	MarketingContent,
	MarketingSocialLinksList,
	MarketingCanvasGrid,
}
