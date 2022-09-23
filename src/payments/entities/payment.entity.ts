import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'amount' })
  amount: number;

  @Column({ name: 'capture', nullable: true })
  capture: boolean;

  @Column({ name: 'currency' })
  currency: string;

  @Column({ name: 'status' })
  status: string;

  //   @Column({ type: 'jsonb', nullable: true })
  //   user_info: User;

  @OneToOne(() => Order, (order) => order.payment)
  @JoinColumn()
  order: Order;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
