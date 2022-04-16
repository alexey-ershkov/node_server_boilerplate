import { hashSync } from 'bcrypt';

export const hash = (data) => hashSync(data, 5);
