import { removeTrailing } from './removeTrailing';

export const fixSelfLink = (selfLink: string) => {
  selfLink = removeTrailing(selfLink, '/');

  if (!selfLink.startsWith('/')) {
    return selfLink;
  }

  return `https://www.furaffinity.net${selfLink}`;
}
