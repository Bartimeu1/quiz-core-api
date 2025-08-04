import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Test } from './test.schema';

@Schema({
  toJSON: {
    versionKey: false,
    transform(doc: Document, ret: Record<string, any>) {
      ret.id = ret._id.toString();
      delete ret._id;
    },
  },
})
export class Question extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ type: [String], required: true })
  options: string[];

  @Prop({ type: [String], required: true })
  correctAnswers: string[];

  @Prop({ type: Boolean, required: true })
  multiSelect: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Test' })
  test: Test;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
