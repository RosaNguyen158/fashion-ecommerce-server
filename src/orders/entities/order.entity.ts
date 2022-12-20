import { Exclude } from 'class-transformer';
import { Payment } from 'src/payments/entities/payment.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
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

  @Column({ name: 'shipping_province', nullable: true })

  shippingProvince: string;

  @Column({ name: 'shipping_district', nullable: true })
  shippingDistrict: string;

  @Column({ name: 'detail_address', nullable: true })
  detailAddress: string;

  @Column({ name: 'shipping_phone', type: 'int', nullable: true })
  shippingPhone: string;


  @Column({ name: 'shipping_cost', type: 'numeric', nullable: true })
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

  @OneToOne(() => Payment, (payment) => payment.order)
  payment: Payment;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
