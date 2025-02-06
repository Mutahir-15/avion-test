export interface Product {
  features: any;
  tags: any;
  category: any;
  _id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  dimensions: {
    height: string;
    width: string;
    depth: string;
  };
  image_url: string;
}