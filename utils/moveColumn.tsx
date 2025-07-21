const range = (from: number, to: number) => {
  return from > to
    ? []
    : Array.from({ length: to - from + 1 }, (value, idx) => idx + from);
};

export const moveColumn = (numCols: number, from: number, to: number) => {
  return from < to
    ? [
        ...range(0, from - 1),
        ...range(from + 1, to),
        from,
        ...range(to + 1, numCols - 1),
      ]
    : [
        ...range(0, to - 1),
        from,
        ...range(to, from - 1),
        ...range(from + 1, numCols - 1),
      ];
};
