import {
  FurAffinityClient,
  type FurAffinityClientOptions,
  type SearchPage,
  type AtLeastOne,
  type SearchQueryBody,
  type SearchQueryParams,
} from './FurAffinityClient';
import { FurAffinityError, type FurAffinityErrorOptions } from './FurAffinityError';
import { FurAffinityURL } from './FurAffinityURL';
import { submissionSchema, type Submission } from './submission';

export {
  FurAffinityClient,
  FurAffinityError,
  FurAffinityURL,
  submissionSchema,

  type Submission,
  type FurAffinityClientOptions,
  type FurAffinityErrorOptions,

  type SearchPage,
  type AtLeastOne,
  type SearchQueryBody,
  type SearchQueryParams,
};
