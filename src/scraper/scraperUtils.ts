import * as cheerio from 'cheerio';
import { parse, isValid } from 'date-fns';

import { fixFaUrl } from '../utils';

const dateFormats = [
  'MMM do, yyyy hh:mm aa', // Sep 27th, 2021 06:16 AM (standard)
  'MMM do, yyyy, hh:mm aa', // Sep 27th, 2021, 06:16 AM (beta note)
  'MMM do, yyyy hh:mmaa', // Sep 27, 2021 06:16AM (beta note list)
];

const reThumbnail = /^\/\/t\.facdn\.net\/(\d+)@(\d+)-(\d+)/;

const readDateField = (field: string): Date | null => {
  if (!field) {
      return null;
  }

  // Strip out field prefix
  if (field.startsWith('on ')) {
      field = field.slice(3);
  }

  // Try all known date formats
  for (const format of dateFormats) {
    const parsedDate = parse(field, format, new Date());

    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }

  return null;
}

export const scraperUtils = {
  pickStaticValue: <T>(value: T) => {
    return {
      selector: ':root',
      how: () => value,
    };
  },

  converter: (convert: (value: unknown, element: cheerio.Cheerio) => unknown): ((value: unknown) => unknown) => {
    return convert as (value: unknown) => unknown;
  },

  pickFaUrl: (selector: string, attr: string) => {
    return {
      selector,
      attr,
      convert: fixFaUrl,
    };
  },

  pickImage: (selector: string = 'img', attr: string = 'src') => {
    return scraperUtils.pickFaUrl(selector, attr);
  },

  pickLink: (selector: string = 'a') => {
    return scraperUtils.pickFaUrl(selector, 'href');
  },

  pickHtml: (selector: string) => {
    return {
      selector,
      how: 'html',
    };
  },

  pickDateFromSpan: (selector: string) => {
    return {
      selector,
      how: (source: cheerio.Selector) => {
        // scrape-it has bad typings
        const ss = source as unknown as cheerio.Cheerio;
        const text = ss.text();
        const title = ss.attr('title');

        if (text) {
          const textVal = readDateField(text);

          if (textVal) {
            return textVal;
          }
        }

        if (title) {
          const attrVal = ss.attr('title');

          if (!attrVal) {
            return null;
          }

          const titleVal = readDateField(attrVal);

          if (titleVal) {
            return titleVal;
          }
        }

        return null;
      },
    };
  },

  pickFigureId: () => {
    return {
      attr: 'id',
      convert: (sid: string) => {
        return Number(sid.split('-')[1]);
      },
    };
  },
};
