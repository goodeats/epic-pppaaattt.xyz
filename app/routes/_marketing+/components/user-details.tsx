import {
	MarketingDetailsSection,
	MarketingLogoImage,
} from '#app/components/layout/marketing'
import { getUserImgSrc } from '#app/utils/misc'
import { type IUserMarketing } from '..'
import { ContentBody, ContentContact, ContentHeader } from './content'

export const UserDetails = ({ user }: { user: IUserMarketing }) => {
	return (
		<MarketingDetailsSection className="xl:mt-0">
			<MarketingLogoImage
				alt="Pat Needham"
				src={getUserImgSrc(user.image?.id)}
			/>
			<ContentHeader username={user.username} />
			<ContentBody bio={user.bio} />
			<ContentContact ig={user.sm_url_instagram} gh={user.sm_url_github} />
		</MarketingDetailsSection>
	)
}
