import { camelCase, mapKeys, snakeCase } from 'lodash';

export const transforms = (obj) => mapKeys(obj, (v, k) => snakeCase(k));
export const camelize = (obj) => mapKeys(obj, (v, k) => camelCase(k));
