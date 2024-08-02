export const fixSelfLink = (selfLink: string) => {
  if (!selfLink.startsWith('/')) {
    return selfLink;
  }

  return `https://www.furaffinity.net${selfLink}`;
}
