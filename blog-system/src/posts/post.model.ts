import { getModelForClass, prop } from "@hasezoey/typegoose";

export class Post {
  @prop()
  title: string
  @prop()
  content: string
}

export const PostModel = getModelForClass(Post) 