import {
	MarketingContent,
	MarketingHeader,
	MarketingLogoLink,
	MarketingSocialLinksList,
} from '#app/components/layout/marketing'
import { Icon } from '#app/components/ui/icon'

export const ContentLogo = () => {
	return (
		<MarketingLogoLink href="https://github.com/goodeats/epic-pppaaattt.xyz">
			<svg
				className="size-20 text-foreground xl:-mt-4"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 65 65"
			>
				<polygon fill="currentColor" points="32.5,22.33 20.5,2.66 44.5,2.66" />
				<polygon fill="currentColor" points="12.5,42.66 0.5,62.33 24.5,62.33" />
				<polygon
					fill="currentColor"
					points="52.5,64.33 40.5,44.66 64.5,44.66"
				/>
			</svg>
		</MarketingLogoLink>
	)
}

export const ContentHeader = () => {
	return (
		<MarketingHeader data-heading>
			<a href="https://github.com/goodeats/epic-pppaaattt.xyz">PPPAAATTT</a>
		</MarketingHeader>
	)
}

export const ContentBody = () => {
	return (
		<div>
			<MarketingContent data-paragraph>
				Welcome to my digital gallery. My name is Pat and I am a software
				engineer turned generative artist from Maine, now living in New York
				City.
			</MarketingContent>
			<MarketingContent data-paragraph>
				My art consists of bridging the gap between the precision of programming
				and the boundless world of art. It is a celebration of simplicity and
				complexity, where equilateral triangles become the building blocks for a
				series of algorithms that produce mesmerizing visual displays.
			</MarketingContent>
		</div>
	)
}

export const ContentContact = () => {
	return (
		<MarketingSocialLinksList>
			<li>
				<a
					href="https://www.instagram.com/pppaaattt.xyz"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Icon name="instagram-logo" size="xl" />
				</a>
			</li>
			<li>
				<a
					href="https://github.com/goodeats"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Icon name="github-logo" size="xl" />
				</a>
			</li>
		</MarketingSocialLinksList>
	)
}
