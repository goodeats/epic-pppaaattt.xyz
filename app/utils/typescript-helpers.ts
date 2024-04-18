// Defines a type that represents the values of an object T.
// very useful for enums
export type ObjectValues<T> = T[keyof T]

/**
 * Safely assigns a value to a key on a target object, with an optional null check.
 * @param target The target object to which the value will be assigned.
 * @param key The key on the target object.
 * @param value The value to be assigned to the key on the target object.
 */
export const safelyAssignValue = <
	TargetType extends object,
	KeyType extends keyof TargetType,
>(
	target: TargetType,
	key: KeyType,
	value: TargetType[KeyType] | null,
): void => {
	if (value !== null) {
		// As TypeScript cannot infer that `value` is not null inside this block,
		// we assert it as `TargetType[KeyType]`.
		target[key] = value as TargetType[KeyType]
	}
}

// Helper function to safely update properties
export function updateProperty<T, K extends keyof T>(
	obj: T,
	key: K,
	value: T[K],
) {
	obj[key] = value
}
