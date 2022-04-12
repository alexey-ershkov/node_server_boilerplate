import { hashSync } from 'bcrypt';
import { camelCase, mapKeys, snakeCase } from 'lodash';

export const decamelize = (obj) => mapKeys(obj, (v, k) => snakeCase(k));
export const camelize = (obj) => mapKeys(obj, (v, k) => camelCase(k));

export const hash = (data) => hashSync(data, 5);
