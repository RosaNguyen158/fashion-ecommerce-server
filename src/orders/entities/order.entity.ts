import { Exclude } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentMethod } from '../enum/payment-methods-enum';
import { PaymentStatus } from '../enum/payment-status-enum';
import { OrderDetail } from './order-detail.entitty';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'shipping_province' })
  shippingProvince: string;

  @Column({ name: 'shipping_district' })
  shippingDistrict: string;

  @Column({ name: 'detail_address' })
  detailAddress: string;

  @Column({ name: 'shipping_phone', type: 'int' })
  shippingPhone: string;

  @Column({ name: 'shipping_cost', type: 'numeric' })
  shippingCost: number;

  @Column({ name: 'order_amount', type: 'numeric', default: 0 })
  orderAmount: number;

  @Column({ name: 'payment_method', default: 'OFFLINE' })
  paymentMethod: PaymentMethod;

  @Column({ name: 'payment_status', nullable: true })
  paymentStatus: PaymentStatus;

  @ManyToOne(() => User, (user) => user.orders, { eager: false })
  @Exclude({
    toPlainOnly: true,
  })
  user: User;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, {
    eager: true,
  })
  // @Exclude({
  //   toPlainOnly: true,
  // })
  orderDetails: OrderDetail[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
