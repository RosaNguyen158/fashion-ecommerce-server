import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from './cart.entity';

@Entity({ name: 'cart_details' })
export class CartDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cart, (cart) => cart.cart_details, { eager: false })
  // @Exclude({
  //   toPlainOnly: true,
  // })
  cart: Cart;

  //   toPlainOnly: true, { eager: false },
  @ManyToOne(() => Product, (product) => product.cartDetails, { eager: false })
  // @Exclude({
  // })
  product: Product;

  @Column({ name: 'quantity' })
  quantity: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
