import path from 'path';

const environments = ['development', 'production', 'docker'];
const env = environments.includes(process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';

export const envPath = path.join(__dirname, '../../../environments', `${env}.env`);
