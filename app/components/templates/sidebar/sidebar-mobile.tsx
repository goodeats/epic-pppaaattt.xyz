import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import { Sheet, SheetContent, SheetTrigger } from '#app/components/ui/sheet'

export const SidebarMobile = ({ children }: { children: JSX.Element }) => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline">
					<Icon name="hamburger-menu">
						<span className="sr-only">Open</span>
					</Icon>
				</Button>
			</SheetTrigger>
			<SheetContent side="left">{children}</SheetContent>
		</Sheet>
	)
}
