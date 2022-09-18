import { Exclude } from 'class-transformer';
import { CartDetail } from 'src/carts/entities/cart-detail.entity';
import { Cart } from 'src/carts/entities/cart.entity';
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

  @Column({ name: 'product_image', nullable: true })
  productImage: string;

  @Column({ name: 'name', unique: true })
  name: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'price', type: 'numeric' })
  price: number;

  @Column({ name: 'discount', type: 'numeric', nullable: true })
  discount: number;

  @ManyToOne(() => Category, (category) => category.products, { eager: false })
  @Exclude({
    toPlainOnly: true,
  })
  category: Category;

  @OneToMany(() => CartDetail, (cartDetail) => cartDetail.product, {
    eager: true,
  })
  cartDetails: CartDetail[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
