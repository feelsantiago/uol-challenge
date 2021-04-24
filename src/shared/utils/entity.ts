import { Types } from 'mongoose';

export interface Entity {
    _id: Types.ObjectId;

    id: string;

    createdAt: Date;

    updatedAt: Date;
}
