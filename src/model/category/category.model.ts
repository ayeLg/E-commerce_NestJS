import Property from 'src/util/decorator/model/property.decorator';

export class Category {
  @Property({ required: true, type: String }, { example: 'Phone' })
  name: string;
}
