import { Exclude } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.sessions, { eager: false })
  @Exclude({
    toPlainOnly: true,
  })
  user: User;

  @Column({ name: 'province', nullable: true })
  province: string;

  @Column({ name: 'district', nullable: true })
  district: string;

  @Column({ name: 'address_detail', nullable: true })
  addressDetail: string;

  @Column({ name: 'is_default', type: 'boolean' })
  isDefault: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
