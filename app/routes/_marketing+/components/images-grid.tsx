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
		<div className="mt-16 flex max-w-3xl flex-wrap gap-8 xl:mt-0 xl:grid xl:grid-flow-col xl:grid-cols-2 xl:grid-rows-2">
			{images.map((image, index) => {
				return (
					<div
						key={index}
						className={cn(
							columnClasses[image.column],
							rowClasses[image.row],
							'relative',
						)}
					>
						<img
							src={image.src}
							alt={image.alt}
							className="relative left-0 top-0 h-full w-full object-cover"
						/>
					</div>
				)
			})}
		</div>
	)
}
