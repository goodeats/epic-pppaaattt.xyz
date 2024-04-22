// TODO: add mechanism to fix broken linked lists
// i.e., two heads, two tails, missing items, etc.

interface ILinkedItem {
	id: string
	nextId: string | null
	prevId: string | null
}

export const orderLinkedItems = <T extends ILinkedItem>(items: T[]): T[] => {
	const heads = items.filter(item => !item.prevId)
	if (heads.length > 1) {
		console.warn('Multiple heads found in the linked list.')
	}

	const tails = items.filter(item => !item.nextId)
	if (tails.length > 1) {
		console.warn('Multiple tails found in the linked list.')
	}

	// Step 1: Find the head of the list
	const head = items.find(item => !item.prevId)
	if (!head) return []

	// Step 2: Sequentially order the items starting from the head
	const orderedItems: T[] = [head]
	let currentItem = head
	while (currentItem.nextId) {
		const nextId = currentItem.nextId
		const nextItem = items.find(item => item.id === nextId)

		if (nextItem) {
			orderedItems.push(nextItem)
			currentItem = nextItem
		} else {
			break
		}
	}

	return orderedItems
}
