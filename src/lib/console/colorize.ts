type Color = 'red' | 'green' | 'cyan' | 'yellow' | 'blue' | 'white';

export function colorize(msg: string, color?: Color) {
  if (process.env.APP_ENV === 'client') {
    return console.log(msg, {
      color,
    });
  }

  const selectedColor = getColor(color);
  const reset = '\x1b[0m';

  return `\x1b[1m${selectedColor}${msg}${reset}`;
}

function getColor(color?: Color) {
  // white by default
  switch (color) {
    case 'blue':
      return '\x1b[34m';
    case 'cyan':
      return '\x1b[36m';
    case 'green':
      return '\x1b[32m';
    case 'red':
      return '\x1b[31m';
    case 'yellow':
      return '\x1b[33m';
    case 'white':
    default:
      return '\x1b[37m';
  }
}
