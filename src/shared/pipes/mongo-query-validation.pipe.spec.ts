import { MongoQueryValidationPipe } from './mongo-query-validation.pipe';

describe('MongoQueryValidationPipe', () => {
    let mongoQueryValidationPipe: MongoQueryValidationPipe;

    beforeEach(() => {
        mongoQueryValidationPipe = new MongoQueryValidationPipe();
    });

    it('Should transform each string property to regex with case-insensitive', () => {
        const mock = {
            name: 'test',
            state: 'test',
            age: 10,
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = mongoQueryValidationPipe.transform(mock, {} as any);

        expect(typeof mock.age).toBe('number');
        expect(result.age).toBe(mock.age);
        expect(result.name).toBeInstanceOf(RegExp);
        expect(result.state).toBeInstanceOf(RegExp);

        {
            const regex = result.name as RegExp;
            expect(regex.flags).toBe('i');
            expect(regex.source).toBe(`^${mock.name}`);
            expect(regex.test('Test')).toBe(true);
        }

        {
            const regex = result.state as RegExp;
            expect(regex.flags).toBe('i');
            expect(regex.source).toBe(`^${mock.state}`);
            expect(regex.test('Test')).toBe(true);
        }
    });
});
