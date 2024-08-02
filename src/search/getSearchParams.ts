import type { SearchQueryParams as FASearchQueryParams } from 'fa.js';

import type { SearchQueryParams } from './types';

export const getSearchParams = (params?: SearchQueryParams): Partial<FASearchQueryParams> | undefined => {
  return {
    mode: params?.mode ?? 'extended',
    perpage: params?.perPage,
    order_by: params?.orderBy,
    order_dir: params?.orderDirection,
    range: params?.range,
    ratings: {
      general: params?.ratings?.general ?? true,
      mature: params?.ratings?.mature ?? true,
      adult: params?.ratings?.adult ?? true,
    },
    types: {
      art: params?.types?.art ?? true,
      flash: params?.types?.flash ?? true,
      photo: params?.types?.photo ?? true,
      music: params?.types?.music ?? true,
      story: params?.types?.story ?? true,
      poetry: params?.types?.poetry ?? true,
    },
  };
}
