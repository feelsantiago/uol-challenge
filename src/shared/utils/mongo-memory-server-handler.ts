// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Collection, Connection } from 'mongoose';

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

        const promises = [].map.call(collections, (collection: Collection) =>
            collection.deleteMany({}),
        ) as Promise<unknown>[];

        await Promise.all(promises);
    }
}
