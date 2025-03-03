import { Exclude, instanceToPlain } from "class-transformer";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  full_name: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  refresh_token: string;

  toJSON() {
    return instanceToPlain(this);
  }
}
