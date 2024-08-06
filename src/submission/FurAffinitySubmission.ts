import { isNumber } from 'radash';
import * as cheerio from 'cheerio';

import { internalSubmissionSchema, InternalSubmission, Submission } from './schema';
import { FurAffinityURL } from '../FurAffinityURL';
import { scraperUtils, type FurAffinityScraper, ScrapeOptions, selectors } from '../scraper';
import { fixFaUrl } from '../utils';

export class FurAffinitySubmission {
  readonly scraper: FurAffinityScraper;

  constructor(scraper: FurAffinityScraper) {
    this.scraper = scraper;
  }

  extractSubmissionId = (url: string): number => {
    if (!FurAffinityURL.checkIsValidHostName(url)) {
      throw new Error(`Invalid URL hostname: ${url}`);
    }

    const urlObj = new URL(url);

    const [viewStr, idStr] = urlObj.pathname.split('/').filter(Boolean);

    if (viewStr !== 'view') {
      throw new Error(`Invalid URL pathname: ${url}`);
    }

    const id = Number(idStr);

    if (!isNumber(id)) {
      throw new Error(`Invalid URL ID: ${url}`);
    }

    return id;
  }

  findOne = async (idOrUrl: number | string): Promise<Submission> => {
    const id = typeof idOrUrl === 'string' ? this.extractSubmissionId(idOrUrl) : idOrUrl;
    const path = `/view/${id}/`;

    const common = {
      id: scraperUtils.pickStaticValue(id),
      url: scraperUtils.pickStaticValue(fixFaUrl(path)),
      type: {
        selector: '#submissionImg',
        convert: scraperUtils.converter((v, element) => {
          return getSubmissionType(element);
        }),
      },
      thumbnailUrl: scraperUtils.pickImage('#submissionImg', 'data-preview-src'),
    } satisfies ScrapeOptions<Partial<InternalSubmission>>;

    const parsed = await this.scraper.fetchAndScrape<InternalSubmission>(path, {
      classic: {
        ...common,
        title: '#page-submission div.classic-submission-title.information > h2',
        contentUrl: {
          selector: '#page-submission',
          convert: scraperUtils.converter((v, element) => {
            const imageElement = element.find("#submissionImg");
            const type = getSubmissionType(imageElement);

            if (type === 'image') {
              return fixFaUrl(imageElement.attr('data-fullview-src') ?? '');
            }

            if (type === 'story') {
              return fixFaUrl(element.find(`#text-container ${selectors.stories}`).attr('href') ?? '');
            }

            if (type === 'music') {
              return fixFaUrl(element.find('.audio-player-container audio.audio-player').attr('href') ?? '');
            }

            if (type === 'flash') {
              return fixFaUrl(element.find('object').attr('data') ?? '');
            }
          }),
        },
        authorName: `#page-submission div.classic-submission-title.information > ${selectors.user}`,
        authorUrl: scraperUtils.pickLink(`#page-submission div.classic-submission-title.information > ${selectors.user}`),
        authorAvatar: scraperUtils.pickImage(`#page-submission div.classic-submissiont-title.avatar ${selectors.user} > img`),
        descriptionText: '#page-submission > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td',
        descriptionHtml: scraperUtils.pickHtml('#page-submission > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td'),
        postedAt: scraperUtils.pickDateFromSpan('#page-submission td.stats-container span.popup_date'),
        keywords: {
          listItem: '#page-submission #keywords > a',
          data: {
            value: '',
          },
          convert: (data: { value: string; }) => data.value,
        },
      },

      beta: {
        ...common,
        title: '#submission_page div.submission-title p',
        contentUrl: {
          selector: '#submission_page',
          convert: scraperUtils.converter((v, element) => {
            const imageElement = element.find("#submissionImg");
            const type = getSubmissionType(imageElement);

            if (type === 'image') {
              return fixFaUrl(imageElement.attr('data-fullview-src') ?? '');
            }

            if (type === 'story') {
              return fixFaUrl(element.find(`.submission-content ${selectors.stories}`).attr('href') ?? '');
            }

            if (type === 'music') {
              return fixFaUrl(element.find('.audio-player-container audio.audio-player').attr('href') ?? '');
            }

            if (type === 'flash') {
              return fixFaUrl(element.find('object').attr('data') ?? '');
            }
          }),
        },
        authorName: `#submission_page .submission-id-container ${selectors.user}`,
        authorUrl: scraperUtils.pickLink(`#submission_page .submission-id-container ${selectors.user}`),
        authorAvatar: scraperUtils.pickImage(`#submission_page .submission-id-avatar ${selectors.user} > img`),
        descriptionText: '#submission_page div.submission-description',
        descriptionHtml: scraperUtils.pickHtml('#submission_page div.submission-description'),
        postedAt: scraperUtils.pickDateFromSpan('#submission_page .submission-id-container span.popup_date'),
        keywords: {
          listItem: '#submission_page div.submission-sidebar section.tags-row > span.tags > a',
          data: {
            value: '',
          },
          convert: (data: { value: string; }) => data.value,
        },
      },
    });

    return internalSubmissionSchema.parse(parsed);
  }
}

const getSubmissionType = (element: any) => {
  if (element.attr('src')) {
    const src = element.attr('src');
    if (src.includes('/stories/') || src.includes('poetry')) {
      return 'story';
    }

    if (src.includes('/music/')) {
      return 'music';
    }

    return 'image';
  } else {
    // probably flash
    const obj = element.find('object');

    if (obj) {
      return 'flash';
    }
  }

  return 'unknown';
}
