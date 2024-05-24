import {
	MarketingContent,
	MarketingHeader,
	MarketingSocialLinksList,
} from '#app/components/layout/marketing'
import { Icon } from '#app/components/ui/icon'

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
