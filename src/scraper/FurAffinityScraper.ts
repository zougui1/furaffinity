import * as cheerio from 'cheerio';
import scrape from 'scrape-it';
import sanitizeHtml from 'sanitize-html';

import { checkErrors, determineSiteVersion } from './utils';
import type { DualScrapeOptions } from './types';
import { FetchConfig, hHttpClient } from '../HttpClient';
import { FURAFFINITY_ORIGIN } from '../constants';

const disallowedTags = new Set(['script', 'style', 'xml']);
const allowedTags = [
  'html',
  'body',
  'img',
  ...sanitizeHtml.defaults.allowedTags.filter(tag => !disallowedTags.has(tag)),
];

export class FurAffinityScraper {
  readonly #cookieA: string;
  readonly #cookieB: string;
  readonly #http = new hHttpClient();

  constructor(options: FurAffinityScraperOptions) {
    this.#cookieA = options.cookieA;
    this.#cookieB = options.cookieB;
  }

  fetch = async (path: string, config?: FetchConfig): Promise<string> => {
    const url = `${FURAFFINITY_ORIGIN}${path}`;
    const res = await this.#http.fetch(url, {
      ...config,
      cookies: [`b=${this.#cookieB}`, `a=${this.#cookieA}`, 's=1'].join(';'),
    });

    checkErrors(res, url);
    return res.body;
  }

  scrape = <T>(body: string, options: DualScrapeOptions<T>): T => {
    const safeHtml = sanitizeHtml(body, {
      allowedTags,
      disallowedTagsMode: 'discard',
      allowedAttributes: false,
    });
    const doc = cheerio.load(safeHtml);
    const siteVersion = determineSiteVersion(doc);
    const scrapeOptions = siteVersion === 'beta' ? options.beta : options.classic;
    const scraped = scrape.scrapeHTML<T>(doc, scrapeOptions);

    return scraped;
  }

  fetchAndScrape = async <T>(path: string, options: DualScrapeOptions<T>, fetchConfig?: FetchConfig): Promise<T> => {
    const body = await this.fetch(path, fetchConfig);
    return this.scrape<T>(body, options);
  }
}

export interface FurAffinityScraperOptions {
  cookieA: string;
  cookieB: string;
}
