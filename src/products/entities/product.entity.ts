import { Exclude } from 'class-transformer';
import { CartDetail } from 'src/carts/entities/cart-detail.entity';
import { Category } from 'src/categories/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  productImage: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ type: 'numeric' })
  price: number;

  @Column({ type: 'numeric', nullable: true })
  discount: number;

  @ManyToOne(() => Category, (category) => category.products, { eager: false })
  @Exclude({
    toPlainOnly: true,
  })
  category: Category;

  @OneToMany(() => CartDetail, (cartDetail) => cartDetail.product, {
    eager: true,
  })
  // @Exclude({
  //   toPlainOnly: true,
  // })
  cartDetails: CartDetail[];

  @OneToMany(() => CartDetail, (orderDetail) => orderDetail.product, {
    eager: true,
  })
  // @Exclude({
  //   toPlainOnly: true,
  // })
  orderDetails: CartDetail[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
