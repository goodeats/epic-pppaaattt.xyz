import {
	DashboardCard as BaseDashboardCard,
	DashboardCardContent,
	DashboardCardFooter,
	DashboardCardFooterLink,
	DashboardCardNone,
	DashboardCardWrapper,
} from '#app/components/layout'
import { type IArtboard } from '#app/models/artboard.server'
import { type IProjectWithArtboards } from '#app/models/project/project.server'

type DashboardCardEntitiesType = IProjectWithArtboards[] | IArtboard[]
type DashboardCardEntityType = IProjectWithArtboards | IArtboard
type DashboardCardType = 'Project' | 'Artboard'

export const DashboardEntityCards = ({
	entities,
	type,
	parent,
	basePathNew,
	basePathEditor,
	basePathView,
	noEntityText,
	newEntityText,
}: {
	entities: DashboardCardEntitiesType
	type: DashboardCardType
	parent: string
	// some entities have different new paths if nested
	basePathNew?: string
	basePathEditor: string
	basePathView: string
	noEntityText?: string
	newEntityText?: string
}) => {
	if (entities.length === 0) {
		return (
			<DashboardEntitiesEmpty
				type={type}
				basePath={basePathNew || basePathEditor}
				newEntityText={newEntityText}
				noEntityText={noEntityText}
				newEntityParent={parent}
			/>
		)
	}

	return (
		<DashboardCardWrapper>
			<NewEntityCard
				type={type}
				parent={parent}
				basePath={basePathNew || basePathEditor}
				buttonText={newEntityText}
			/>
			{entities.map(item => (
				<ExistingEntityCard
					key={item.id}
					item={item}
					type={type}
					basePathEditor={basePathEditor}
					basePathView={basePathView}
				/>
			))}
		</DashboardCardWrapper>
	)
}

const DashboardEntitiesEmpty = ({
	type,
	basePath,
	newEntityText,
	newEntityParent,
	noEntityText,
}: {
	type: DashboardCardType
	basePath: string
	newEntityText?: string
	newEntityParent: string
	noEntityText?: string
}) => (
	<DashboardCardWrapper>
		<NewEntityCard
			type={type}
			parent={newEntityParent}
			basePath={basePath}
			buttonText={newEntityText}
		/>
		<DashboardCardNone>
			{noEntityText || `No ${type.toLocaleLowerCase()}s found`}
		</DashboardCardNone>
	</DashboardCardWrapper>
)

const NewEntityCard = ({
	type,
	parent,
	basePath,
	buttonText,
}: {
	type: DashboardCardType
	parent: string
	basePath: string
	buttonText?: string
}) => (
	<BaseDashboardCard
		title={`New ${type}`}
		description={`Create a new ${type.toLowerCase()}`}
	>
		<DashboardCardContent>
			{`Add a new ${type.toLowerCase()} to your ${parent}.`}
		</DashboardCardContent>
		<DashboardCardFooter>
			<DashboardCardFooterLink to={`${basePath}/new`} icon="plus">
				{buttonText || `New ${type}`}
			</DashboardCardFooterLink>
		</DashboardCardFooter>
	</BaseDashboardCard>
)

const ExistingEntityCard = ({
	item,
	type,
	basePathEditor,
	basePathView,
}: {
	item: DashboardCardEntityType
	type: DashboardCardType
	basePathEditor: string
	basePathView: string
}) => (
	<BaseDashboardCard title={item.name} description={item.description || ''}>
		<DashboardCardContent>
			<ExistingEntityCardContent item={item} type={type} />
		</DashboardCardContent>
		<ExistingEntityCardFooter
			item={item}
			basePathEditor={basePathEditor}
			basePathView={basePathView}
		/>
	</BaseDashboardCard>
)

const ExistingEntityCardContent = ({
	item,
	type,
}: {
	item: DashboardCardEntityType
	type: DashboardCardType
}) => {
	switch (type) {
		case 'Project':
			const project = item as IProjectWithArtboards
			const artboardNames = project.artboards
				.map(artboard => artboard.name)
				.join(', ')
			return artboardNames.length === 0 ? 'No artboards' : artboardNames
		case 'Artboard':
			const artboard = item as IArtboard
			return `Visible: ${artboard.isVisible ? 'Yes' : 'No'}`
		default:
			return 'No details available'
	}
}

const ExistingEntityCardFooter = ({
	item,
	basePathEditor,
	basePathView,
}: {
	item: DashboardCardEntityType
	basePathEditor: string
	basePathView: string
}) => (
	<DashboardCardFooter>
		<DashboardCardFooterLink
			to={`${basePathEditor}/${item.slug}/edit`}
			icon="pencil-1"
		>
			Edit
		</DashboardCardFooterLink>
		<DashboardCardFooterLink
			to={`${basePathView}/${item.slug}`}
			icon="arrow-right"
		>
			Go
		</DashboardCardFooterLink>
	</DashboardCardFooter>
)
