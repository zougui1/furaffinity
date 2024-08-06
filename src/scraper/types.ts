import type { ScrapeOptionElement } from 'scrape-it';
import type * as cheerio from 'cheerio';

type Unarray<T> = T extends Array<infer U> ? U : T;

export interface TypedScrapeOptionList<T> {
  listItem: string;
  data?: ScrapeOptions<T>;
  convert?: (value: unknown) => unknown;
  how?: string | ((element: cheerio.Selector) => unknown);
}

export type ScrapeOptions<T> = {
  [P in keyof T]: (
    | string
    | TypedScrapeOptionList<Unarray<T[P]>>
    | ScrapeOptionElement
  );
} | { value?: any };

export interface DualScrapeOptions<T> {
  classic: ScrapeOptions<T>;
  beta: ScrapeOptions<T>;
}
