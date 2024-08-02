export interface SearchQueryParams {
  perPage?: 24 | 48 | 72;
  orderBy?: 'relevancy' | 'date' | 'popularity';
  orderDirection?: 'desc' | 'asc';
  range?: (
    | '24hours'
    | '72hours'
    | '30days'
    | '90days'
    | '1year'
    | '3years'
    | '5years'
    | 'all'
  );
  ratings?: {
    general?: boolean;
    mature?: boolean;
    adult?: boolean;
  };
  types?: {
    art?: boolean;
    flash?: boolean;
    photo?: boolean;
    music?: boolean;
    story?: boolean;
    poetry?: boolean;
  };
  mode?: 'any' | 'all' | 'extended';
}

export interface SearchPageOptions extends SearchQueryParams {
  page?: number;
}

export interface SearchOptions extends SearchQueryParams {
  startPage?: number;
}

export interface SearchPage {
  submissions: SubmissionListing[];
  more: boolean;
}

export interface SubmissionListing {
  id: number;
  url: string;
  thumbnailUrl: string;
  title: string;
  authorName: string;
  postedAt: Date;
}
