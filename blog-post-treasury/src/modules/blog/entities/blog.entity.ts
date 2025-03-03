import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'blog' })
export class Blog extends BaseEntity {
  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  image: string;
}
