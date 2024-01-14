import { Icon } from '#app/components/ui/icon'

export const ContentLogo = () => {
	return (
		<a
			href="https://github.com/goodeats/epic-pppaaattt.xyz"
			className="animate-slide-top [animation-fill-mode:backwards] xl:animate-slide-left xl:[animation-delay:0.5s] xl:[animation-fill-mode:backwards]"
		>
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
		</a>
	)
}

export const ContentHeader = () => {
	return (
		<h1
			data-heading
			className="mt-8 animate-slide-top text-4xl font-medium text-foreground [animation-fill-mode:backwards] [animation-delay:0.3s] md:text-5xl xl:mt-4 xl:animate-slide-left xl:text-6xl xl:[animation-fill-mode:backwards] xl:[animation-delay:0.8s]"
		>
			<a href="https://github.com/goodeats/epic-pppaaattt.xyz">PPPAAATTT</a>
		</h1>
	)
}

export const ContentBody = () => {
	return (
		<p
			data-paragraph
			className="mt-6 animate-slide-top text-xl/7 text-muted-foreground [animation-fill-mode:backwards] [animation-delay:0.8s] xl:mt-8 xl:animate-slide-left xl:text-xl/6 xl:leading-10 xl:[animation-fill-mode:backwards] xl:[animation-delay:1s]"
		>
			I am a software engineer from Maine, now living in New York City. My art
			consists of printing equilateral triangles in different ways on a canvas
			using JavaScript. I have worked mostly used my coding skills in various
			startups and now I am excited to pursue the lengths of my creativity.
		</p>
	)
}

export const ContentContact = () => {
	return (
		<ul className="mt-6 flex animate-slide-top space-x-6 [animation-fill-mode:backwards] [animation-delay:1.2s] xl:mt-8 xl:animate-slide-left xl:[animation-fill-mode:backwards] xl:[animation-delay:1.2s]">
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
		</ul>
	)
}
