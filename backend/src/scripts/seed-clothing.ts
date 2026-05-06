import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function seedClothing({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);

  logger.info("Seeding premium clothing data...");

  const [defaultSalesChannel] = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  const shippingProfile = shippingProfiles[0];

  const products = [
    {
      title: "Urban Oversized Hoodie",
      description: "Premium cotton hoodie for maximum comfort and style.",
      handle: "urban-hoodie",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [
        { url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80" }
      ],
      metadata: {
        video_url: "https://res.cloudinary.com/dtw0ajpwa/video/upload/v1712234567/sample-video-1.mp4",
        brand: "URBAN"
      },
      options: [{ title: "Size", values: ["S", "M", "L", "XL"] }],
      variants: [
        {
          title: "M",
          sku: "HOODIE-M",
          options: { Size: "M" },
          prices: [{ amount: 7500, currency_code: "usd" }]
        }
      ],
      sales_channels: [{ id: defaultSalesChannel.id }]
    },
    {
      title: "Heritage Denim Jacket",
      description: "Timeless denim jacket with a modern fit.",
      handle: "denim-jacket",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [
        { url: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=800&q=80" }
      ],
      metadata: {
        video_url: "https://res.cloudinary.com/dtw0ajpwa/video/upload/v1712234568/sample-video-2.mp4",
        brand: "DENIM CO"
      },
      options: [{ title: "Size", values: ["S", "M", "L"] }],
      variants: [
        {
          title: "L",
          sku: "JACKET-L",
          options: { Size: "L" },
          prices: [{ amount: 12000, currency_code: "usd" }]
        }
      ],
      sales_channels: [{ id: defaultSalesChannel.id }]
    },
    {
      title: "Aura Linen Dress",
      description: "Breathable linen dress perfect for summer evenings.",
      handle: "linen-dress",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [
        { url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80" }
      ],
      metadata: {
        video_url: "https://res.cloudinary.com/dtw0ajpwa/video/upload/v1712234567/sample-video-1.mp4",
        brand: "AURA"
      },
      options: [{ title: "Size", values: ["XS", "S", "M"] }],
      variants: [
        {
          title: "S",
          sku: "DRESS-S",
          options: { Size: "S" },
          prices: [{ amount: 9500, currency_code: "usd" }]
        }
      ],
      sales_channels: [{ id: defaultSalesChannel.id }]
    },
    {
      title: "Vanguard Tech Sneakers",
      description: "Advanced cushioning and futuristic design.",
      handle: "tech-sneakers",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [
        { url: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=800&q=80" }
      ],
      metadata: {
        video_url: "https://res.cloudinary.com/dtw0ajpwa/video/upload/v1712234568/sample-video-2.mp4",
        brand: "VANGUARD"
      },
      options: [{ title: "Size", values: ["8", "9", "10", "11"] }],
      variants: [
        {
          title: "10",
          sku: "SHOE-10",
          options: { Size: "10" },
          prices: [{ amount: 15000, currency_code: "usd" }]
        }
      ],
      sales_channels: [{ id: defaultSalesChannel.id }]
    },
    {
      title: "Signature Wool Overcoat",
      description: "Elegant wool overcoat for a professional look.",
      handle: "wool-overcoat",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [
        { url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80" }
      ],
      metadata: {
        video_url: "https://res.cloudinary.com/dtw0ajpwa/video/upload/v1712234567/sample-video-1.mp4",
        brand: "SIGNATURE"
      },
      options: [{ title: "Size", values: ["M", "L", "XL"] }],
      variants: [
        {
          title: "M",
          sku: "COAT-M",
          options: { Size: "M" },
          prices: [{ amount: 25000, currency_code: "usd" }]
        }
      ],
      sales_channels: [{ id: defaultSalesChannel.id }]
    }
  ];

  await createProductsWorkflow(container).run({
    input: { products }
  });

  logger.info("Finished seeding clothing data.");
}
