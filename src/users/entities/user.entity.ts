import { Exclude } from 'class-transformer';
import { Address } from 'src/addresses/entity/address.entity';
import { Session } from 'src/auth/entities/session.entity';
import { Cart } from 'src/carts/entities/cart.entity';
import { Order } from 'src/orders/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
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

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true, unique: true })
  phone: string;

  @Column({ nullable: true })
  otp: string;

  @Column()
  role: UserRoles;

  @Column({ nullable: true })
  customerStripeId: string;

  @OneToMany(() => Address, (address) => address.user, { eager: true })
  @Exclude({
    toPlainOnly: true,
  })
  addresses: Address[];

  @OneToMany(() => Session, (session) => session.user, { eager: true })
  @Exclude({
    toPlainOnly: true,
  })
  sessions: Session[];

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @OneToMany(() => Order, (order) => order.user, { eager: true })
  @Exclude({
    toPlainOnly: true,
  })
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
