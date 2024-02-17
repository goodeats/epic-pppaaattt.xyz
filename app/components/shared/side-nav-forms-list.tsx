import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '../ui/accordion'

const SideNavTabAccordionItem = ({
	value,
	trigger,
	children,
}: {
	value: string
	trigger: string | React.ReactNode
	children: React.ReactNode
}) => {
	return (
		<AccordionItem value={value}>
			<AccordionTrigger>{trigger}</AccordionTrigger>
			<AccordionContent>{children}</AccordionContent>
		</AccordionItem>
	)
}
export { SideNavTabAccordionItem }
