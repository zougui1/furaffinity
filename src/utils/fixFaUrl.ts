import { removeTrailing } from './removeTrailing';

export const fixFaUrl = (str: string) => {
  if (!str) {
    return str;
  }

  str = removeTrailing(str, '/');

  if (str.startsWith('//')) {
    return `https:${str}`;
  }

  if (!str.startsWith('/')) {
    return str;
  }

  return `https://www.furaffinity.net${str}`;
}
