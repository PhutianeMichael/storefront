import { ApiProduct, Product } from '../models/product.model';

export const mapProductResponse = (source: ApiProduct): Product => {
  return {
    id: source.id,
    title: source.title,
    description: source.description,
    price: source.price,
    discountPercentage: source.discountPercentage,
    rating: source.rating,
    stock: source.stock,
    brand: source.brand,
    category: source.category,
    availabilityStatus: source.availabilityStatus,
    dimensions: source.dimensions,
    meta: source.meta,
    returnPolicy: source.returnPolicy,
    reviews: source.reviews,
    shippingInformation: source.shippingInformation,
    tags: source.tags,
    sku: source.sku,
    warrantyInformation: source.warrantyInformation,
    weight: source.weight,
    thumbnail: source.thumbnail,
    images: source.images
  };
}
