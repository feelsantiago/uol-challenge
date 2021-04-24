import { Types } from 'mongoose';

export class Entity {
    public _id: Types.ObjectId;

    public id: string;

    public createdAt: Date;

    public updatedAt: Date;
}
