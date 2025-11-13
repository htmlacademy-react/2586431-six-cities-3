export const classNames = (
  classes: string,
  classMap: Record<string, boolean>
) =>
  [
    classes,
    ...Object.entries(classMap)
      .filter(([, value]) => value)
      .map(([key]) => key),
  ].join(' ');
