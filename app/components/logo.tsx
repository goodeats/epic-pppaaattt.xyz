import { Link } from '@remix-run/react'

// Character component is responsible for creating a recursive layout of the letters in the logo
const Character = ({ char }: { char: string }) => {
	return (
		<div className="flex flex-col">
			{/* It maps over an array of length 2 and for each element, it creates a div component */}
			{[...Array(2)].map((_, i) => (
				<div key={i} className="m-auto mb-[-12px] leading-normal">
					{/* The div component contains the character repeated (i + 1) times */}
					{char.repeat(i + 1)}
				</div>
			))}
		</div>
	)
}

const Logo = () => {
	const str = 'PAT'
	return (
		<Link to="/" className="group grid leading-snug">
			<div className="mt-[-12px] flex flex-col">
				{/* It first renders the Character component for the first character of the string */}
				<Character char={str[0]} />
				<div className="flex">
					{/* Then it maps over the rest of the string and for each character, it renders a Character component */}
					{str
						.slice(1)
						.split('')
						.map((char, i) => (
							<Character key={i} char={char} />
						))}
				</div>
			</div>
		</Link>
	)
}

export default Logo
