import { FurAffinityURL } from './FurAffinityURL';
import { FurAffinityScraper, scraperUtils, type FurAffinityScraperOptions } from './scraper';
import { FurAffinitySubmission } from './submission';

export interface SearchPage {
  submissions: { id: number }[];
}

export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

export interface SearchQueryParams {
  perpage: SearchQueryBody["perpage"];
  order_by: SearchQueryBody["order-by"];
  order_dir: SearchQueryBody["order-direction"];
  range: SearchQueryBody["range"];
  ratings: AtLeastOne<{
    general: boolean;
    mature: boolean;
    adult: boolean;
  }>;
  types: AtLeastOne<{
    art: boolean;
    flash: boolean;
    photo: boolean;
    music: boolean;
    story: boolean;
    poetry: boolean;
  }>;
  mode: SearchQueryBody["mode"];
}

export type SearchQueryBody = {
  q: string;
  page: number;
  perpage: 24 | 48 | 72;
  "order-by": "relevancy" | "date" | "popularity";
  "order-direction": "desc" | "asc";
  do_search: "Search";
  range:
    | "24hours"
    | "72hours"
    | "30days"
    | "90days"
    | "1year"
    | "3years"
    | "5years"
    | "all";
  "rating-general"?: "on";
  "rating-mature"?: "on";
  "rating-adult"?: "on";
  "type-art"?: "on";
  "type-flash"?: "on";
  "type-photo"?: "on";
  "type-music"?: "on";
  "type-story"?: "on";
  "type-poetry"?: "on";
  mode: "any" | "all" | "extended";
};

export class FurAffinityClient {
  static readonly URL = FurAffinityURL;

  readonly scraper: FurAffinityScraper;
  readonly submission: FurAffinitySubmission;

  constructor(options: FurAffinityClientOptions) {
    this.scraper = new FurAffinityScraper(options);
    this.submission = new FurAffinitySubmission(this.scraper);
  }

  search = async (
    query: string,
    params?: Partial<SearchQueryParams>,
    page: number = 1
  ) => {
    return this.scraper.fetchAndScrape<SearchPage>(`/search/`, {
      classic: {
        submissions: {
          listItem: '#gallery-search-results figure.t-image',
          data: {
            id: scraperUtils.pickFigureId(),
          },
        },
      },
      beta: {
        submissions: {
          listItem: '#gallery-search-results figure.t-image',
          data: {
            id: scraperUtils.pickFigureId(),
          },
        },
      },
    },
    {
      method: 'POST',
      body: this.generateSearchBody(query, params, page),
      contentType: 'application/x-www-form-urlencoded',
    });
  }

  protected generateSearchBody = (
    query: string,
    params?: Partial<SearchQueryParams>,
    page: number = 1
  ): SearchQueryBody => {
    // Populate defaults
    const body: SearchQueryBody = {
      q: query,
      page: page,
      perpage: params?.perpage || 72,
      'order-by': params?.order_by || 'relevancy',
      'order-direction': params?.order_dir || 'desc',
      do_search: 'Search',
      range: params?.range || '5years',
      mode: params?.mode || 'extended',
    };

    if (params?.ratings) {
      if (params.ratings.general) body['rating-general'] = 'on';
      if (params.ratings.mature) body['rating-mature'] = 'on';
      if (params.ratings.adult) body['rating-adult'] = 'on';
    } else {
      // Default are everything
      body['rating-general'] = 'on';
      body['rating-mature'] = 'on';
      body['rating-adult'] = 'on';
    }

    if (params?.types) {
      if (params.types.art) body['type-art'] = 'on';
      if (params.types.flash) body['type-flash'] = 'on';
      if (params.types.photo) body['type-photo'] = 'on';
      if (params.types.music) body['type-music'] = 'on';
      if (params.types.story) body['type-story'] = 'on';
      if (params.types.poetry) body['type-poetry'] = 'on';
    } else {
      // Default are everything
      body['type-art'] = 'on';
      body['type-flash'] = 'on';
      body['type-photo'] = 'on';
      body['type-music'] = 'on';
      body['type-story'] = 'on';
      body['type-poetry'] = 'on';
    }

    return body;
  }
}

export interface FurAffinityClientOptions extends FurAffinityScraperOptions {

}
