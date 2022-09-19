import { Exclude } from 'class-transformer';
import { Session } from 'src/auth/entities/session.entity';
import { Cart } from 'src/carts/entities/cart.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoles } from '../user-roles-enum';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  password: string;

  @Column({ name: 'email', nullable: true, unique: true })
  email: string;

  @Column({ name: 'phone', nullable: true, unique: true })
  phone: string;

  @Column({ name: 'otp', nullable: true })
  otp: string;

  @Column({ name: 'default_address', nullable: true })
  defaultAddress: string;

  @Column({ name: 'role' })
  role: UserRoles;

  @Column({ name: 'customer_stripe_id', nullable: true })
  customerStripeId: string;

  @OneToMany(() => Session, (session) => session.user, { eager: true })
  @Exclude({
    toPlainOnly: true,
  })
  sessions: Session[];

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
