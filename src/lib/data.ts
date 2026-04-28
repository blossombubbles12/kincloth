import { Product } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Minimalist Urban Hoodie',
    price: 89.99,
    videoUrl: 'https://cdn.pixabay.com/video/2021/04/12/70860-537466540_large.mp4', // Fashion video
    description: 'A premium, oversized hoodie designed for the modern urban explorer. Made from 100% organic cotton.',
    brand: 'UrbanCore'
  },
  {
    id: '2',
    name: 'Sonic Wireless Earbuds',
    price: 129.50,
    videoUrl: 'https://cdn.pixabay.com/video/2023/10/22/186063-877202359_large.mp4', // Tech/Abstract video
    description: 'Crystal clear sound with active noise cancellation and 24-hour battery life.',
    brand: 'AudioVibe'
  },
  {
    id: '3',
    name: 'Elysian Fragrance No. 5',
    price: 150.00,
    videoUrl: 'https://cdn.pixabay.com/video/2022/01/18/104683-665972351_large.mp4', // Luxury/Fragrance
    description: 'A sophisticated blend of sandalwood, vanilla, and citrus. The essence of elegance.',
    brand: 'Elysian'
  },
  {
    id: '4',
    name: 'Stealth Matte Watch',
    price: 210.00,
    videoUrl: 'https://cdn.pixabay.com/video/2020/09/21/50630-455246754_large.mp4', // Watch/Luxury
    description: 'Precision engineering meets minimalist design. Water-resistant up to 50m.',
    brand: 'Stealth'
  },
  {
    id: '5',
    name: 'Artisan Espresso Beans',
    price: 24.99,
    videoUrl: 'https://cdn.pixabay.com/video/2020/04/12/35928-408985160_large.mp4', // Coffee
    description: 'Ethically sourced, single-origin beans roasted to perfection in small batches.',
    brand: 'BeanCraft'
  }
];
