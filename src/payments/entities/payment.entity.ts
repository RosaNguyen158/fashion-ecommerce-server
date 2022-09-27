import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryColumn()
  id: string;

  @Column()
  amount: number;

  @Column({ nullable: true })
  capture: boolean;

  @Column()
  currency: string;

  @Column()
  status: string;

  //   @Column({ type: 'jsonb', nullable: true })
  //   user_info: User;

  @OneToOne(() => Order, (order) => order.payment)
  @JoinColumn()
  order: Order;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
