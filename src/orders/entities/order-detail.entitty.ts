import { Exclude } from 'class-transformer';
import { Product } from 'src/products/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'order_details' })
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.orderDetails, { eager: false })
  @Exclude({
    toPlainOnly: true,
    // Not show information about user's sessions when return result ,
    // To use this decorator must use TranformInterceptor in app.module,
  })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderDetails)
  product: Product;

  @Column({ type: 'jsonb', nullable: true })
  productInfo: Product;

  @Column({ name: 'quantity' })
  quantity: number;
}
