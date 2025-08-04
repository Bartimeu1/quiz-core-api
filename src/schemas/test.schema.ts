import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  toJSON: {
    versionKey: false,
    transform(doc: Document, ret: Record<string, any>) {
      ret.id = ret._id.toString();
      delete ret._id;
    },
  },
})
export class Test extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TestSchema = SchemaFactory.createForClass(Test);
