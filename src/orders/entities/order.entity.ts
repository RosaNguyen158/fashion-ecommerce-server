import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentMethod } from '../payment-methods-enum';
import { PaymentStatus } from '../payment-status-enum';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'shipping_address', nullable: true })
  shippingAddress: string;

  @Column({ name: 'shipping_phone', type: 'int', nullable: true })
  shippingPhone: number;

  @Column({ name: 'shipping_cost', type: 'numeric', nullable: true })
  shippingCost: number;

  @Column({ name: 'order_amount', type: 'numeric' })
  orderAmount: number;

  @Column({ name: 'payment_method' })
  paymentMethod: PaymentMethod;

  @Column({ name: 'payment_status' })
  paymentStatus: PaymentStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
