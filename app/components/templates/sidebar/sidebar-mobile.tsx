import { Button } from '#app/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '#app/components/ui/sheet'

export const SidebarMobile = () => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline">Open</Button>
			</SheetTrigger>
			<SheetContent>
				<div>mobile sidebar</div>
			</SheetContent>
		</Sheet>
	)
}
