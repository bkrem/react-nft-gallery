// This avoids adding an extra prod dependency like `cn` just to concatenate classNames.
export const joinClassNames = (...args: string[]) => args.join(' ').trim();
