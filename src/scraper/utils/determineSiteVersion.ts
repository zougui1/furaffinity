import scrape from 'scrape-it';
import type * as cheerio from 'cheerio';

export const determineSiteVersion = (doc: cheerio.Root): string => {
  const scraped = scrape.scrapeHTML<{ path: string }>(doc, {
    path: {
      selector: 'body',
      attr: 'data-static-path',
    }
  });

  if (scraped && scraped.path === '/themes/beta') {
    return 'beta';
  }

  return 'classic';
}
