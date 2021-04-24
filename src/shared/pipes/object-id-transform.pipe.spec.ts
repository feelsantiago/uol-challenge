import { Types } from 'mongoose';
import { ObjectIdTransformPipe } from './object-id-transform.pipe';

describe('ObjectIdTransformPipe', () => {
    let objectIdTransformPipe: ObjectIdTransformPipe;

    beforeEach(() => {
        objectIdTransformPipe = new ObjectIdTransformPipe();
    });

    it('Should transform a ObjectId String to ObjectId Type', () => {
        const id = new Types.ObjectId().toHexString();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const objectId = objectIdTransformPipe.transform(id, {} as any);

        expect(objectId).toBeInstanceOf(Types.ObjectId);
        expect(objectId.toHexString()).toStrictEqual(id);
    });

    it('Should throw error when transformation failed', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, unicorn/consistent-function-scoping
        const transform = (): Types.ObjectId => objectIdTransformPipe.transform('test', {} as any);

        expect(transform).toThrow('Invalid Id parameter!');
    });
});
