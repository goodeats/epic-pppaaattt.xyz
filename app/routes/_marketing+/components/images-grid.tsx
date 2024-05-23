import {
	MarketingImage,
	MarketingImageContainer,
	MarketingImagesGrid,
} from '#app/components/layout/marketing'
import { cn } from '#app/utils/misc.tsx'
import { images } from '../images/images'

// Tailwind Grid cell classes lookup
const columnClasses: Record<(typeof images)[number]['column'], string> = {
	1: 'xl:col-start-1',
	2: 'xl:col-start-2',
	3: 'xl:col-start-3',
	4: 'xl:col-start-4',
	5: 'xl:col-start-5',
}
const rowClasses: Record<(typeof images)[number]['row'], string> = {
	1: 'xl:row-start-1',
	2: 'xl:row-start-2',
	3: 'xl:row-start-3',
	4: 'xl:row-start-4',
	5: 'xl:row-start-5',
	6: 'xl:row-start-6',
}

export const ImagesGrid = () => {
	return (
		<MarketingImagesGrid>
			{images.map(image => {
				return (
					<MarketingImageContainer
						key={image.src}
						className={cn(columnClasses[image.column], rowClasses[image.row])}
					>
						<MarketingImage src={image.src} alt={image.alt} />
					</MarketingImageContainer>
				)
			})}
		</MarketingImagesGrid>
	)
}
