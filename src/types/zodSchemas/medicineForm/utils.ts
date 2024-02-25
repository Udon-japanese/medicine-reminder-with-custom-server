export function getDuplicateStringIndexes(array: string[]): number[] {
  const indexMap = new Map();
  const duplicateIndexes = new Set<number>();

  for (let i = 0; i < array.length; i++) {
    const propValue = array[i];

    if (propValue !== '' && indexMap.has(propValue)) {
      duplicateIndexes.add(indexMap.get(propValue) as number);
      duplicateIndexes.add(i);
    } else {
      indexMap.set(propValue, i);
    }
  }

  return Array.from(duplicateIndexes);
}

export function getEmptyStringIndexes(array: string[]): number[] {
  const emptyStringIndexes: number[] = [];

  for (let i = 0; i < array.length; i++) {
    if (array[i].trim() === '') {
      emptyStringIndexes.push(i);
    }
  }

  return emptyStringIndexes;
}

export function getDuplicateDateIndexes(array: Date[]): number[] {
  const duplicateIndexes: number[] = [];
  const dateStringMap: { [date: string]: number[] } = {};

  for (let i = 0; i < array.length; i++) {
    if (Number.isNaN(array[i]?.getTime())) {
      continue;
    }

    const dateString = array[i].toISOString();

    if (dateStringMap[dateString]) {
      dateStringMap[dateString].push(i);
    } else {
      dateStringMap[dateString] = [i];
    }
  }

  for (const date in dateStringMap) {
    if (dateStringMap[date].length > 1) {
      duplicateIndexes.push(...dateStringMap[date]);
    }
  }

  return duplicateIndexes;
}
