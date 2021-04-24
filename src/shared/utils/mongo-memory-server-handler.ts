// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection } from 'mongoose';

export class MongoMemoryServerHandle {
    private readonly mongod = new MongoMemoryServer({ autoStart: false });

    public async start(): Promise<string> {
        await this.mongod.start();
        return this.mongod.getUri();
    }

    public async disconnect(): Promise<boolean> {
        return this.mongod.stop();
    }

    public async clear(connection: Connection): Promise<void> {
        const { collections } = connection;

        const promises = [];
        for (const key in collections) {
            if ({}.hasOwnProperty.call(collections, key)) {
                promises.push(collections[key].deleteMany({}));
            }
        }

        await Promise.all(promises);
    }
}
