export function detectChanges<T extends Record<string, any>>(
  existingData: T,
  newData: Partial<T>,
): Partial<T> {
  return Object.keys(newData).reduce(
    (acc: Record<string, any>, key) => {
      if (
        newData[key] !== undefined && // Ignorar valores undefined
        newData[key] !== existingData[key] // Solo si hay un cambio real
      ) {
        acc[key] = newData[key];
      }
      return acc;
    },
    {} as Record<string, any>,
  ) as Partial<T>;
}

