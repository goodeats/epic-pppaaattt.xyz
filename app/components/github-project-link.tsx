import { Icon } from './ui/icon'

export const GithubProjectLink = () => {
	return (
		<a
			href="https://github.com/goodeats/epic-pppaaattt.xyz"
			className="flex h-8 w-8 cursor-pointer items-center justify-center"
		>
			<Icon name="github-logo">
				<span className="sr-only">GitHub Project</span>
			</Icon>
		</a>
	)
}
