import { Injectable } from '@nestjs/common';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(

  ) {}
  
  async runSeed() {
    await this.insertNewProducts();
    return "exe";
  }

  private async insertNewProducts() {
    //await this.productService.deleteAllProducts();
    const products = initialData.products;

    const insertPromises = []

    products.forEach(product => {
      //insertPromises.push(this.productService.create( product ))
    });

    const results = await Promise.all( insertPromises );

    return results;
  }

}
