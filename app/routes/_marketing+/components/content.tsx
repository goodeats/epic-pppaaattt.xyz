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

export const ContentBody = ({ bio }: { bio: string }) => {
	const bioParagraphs = bio.split('\n').map((paragraph, index) => (
		<MarketingContent key={index} data-paragraph>
			{paragraph}
		</MarketingContent>
	))
	return <div>{bioParagraphs.map(paragraph => paragraph)}</div>
}

// quick and dirty solution to add social links from strings
// will add OAuth2 later
export const ContentContact = ({
	ig,
	gh,
}: {
	ig: string | null
	gh: string | null
}) => {
	return (
		<MarketingSocialLinksList>
			{ig && (
				<li>
					<a href={ig} target="_blank" rel="noopener noreferrer">
						<Icon name="instagram-logo" size="xl" />
					</a>
				</li>
			)}
			{gh && (
				<li>
					<a href={gh} target="_blank" rel="noopener noreferrer">
						<Icon name="github-logo" size="xl" />
					</a>
				</li>
			)}
		</MarketingSocialLinksList>
	)
}
