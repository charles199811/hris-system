// "use server";

// import { prisma } from "@/db/prisma";
// import { converToPlainObject } from "../utils";
// import { LATEST_PRODUCTS_LIMIT } from "../constants";

// //get latest products
// export async function getLatestProduct() {
//   const data = await prisma.product.findMany({
//     take: LATEST_PRODUCTS_LIMIT,
//     orderBy: { createdAt: "desc" },
//   });

//   return converToPlainObject(data);
// }

// //get single product by slug
// export async function getProductBySlug(slug: string) {
//   return await prisma.product.findFirst({
//     where: { slug: slug },
//   });
// }

// // //get single product by ID
// // export async function getProductById(productId: string) {
// //   const data = await prisma.product.findFirst({
// //     where: { id: productId },
// //   });

// //   return converToPlainObject(data);
// // }

// // //Get all products
// // export async function getAllProducts({
// //   query,
// //   limit = PAGE_SIZE,
// //   page,
// //   category,
// //   price,
// //   rating,
// //   sort,
// // }: {
// //   query: string;
// //   limit?: number;
// //   page: number;
// //   category?: string;
// //   price?: string;
// //   rating?: string;
// //   sort?: string;
// // }) {
// //   //Query filter
// //   const queryFilter: Prisma.ProductWhereInput =
// //     query && query !== "all"
// //       ? {
// //           name: {
// //             contains: query,
// //             mode: "insensitive",
// //           } as Prisma.StringFilter,
// //         }
// //       : {};

// //   //Category filter
// //   const categoryFilter = category && category !== "all" ? { category } : {};

// //   //Price Filter
// //   const priceFilter: Prisma.ProductWhereInput =
// //     price && price !== "all"
// //       ? {
// //           price: {
// //             gte: Number(price.split("-")[0]),
// //             lte: Number(price.split("-")[1]),
// //           },
// //         }
// //       : {};

// //   //Ratingfilter
// //   const ratingFilter =
// //     rating && rating !== "all"
// //       ? {
// //           rating: {
// //             gte: Number(rating),
// //           },
// //         }
// //       : {};
// //   const data = await prisma.product.findMany({
// //     where: {
// //       ...queryFilter,
// //       ...categoryFilter,
// //       ...priceFilter,
// //       ...ratingFilter,
// //     },
// //     orderBy:
// //       sort === "lowest"
// //         ? { price: "asc" }
// //         : sort === "highest"
// //         ? { price: "desc" }
// //         : sort === "rating"
// //         ? { rating: "desc" }
// //         : { createdAt: "desc" },
// //     skip: (page - 1) * limit,
// //     take: limit,
// //   });

// //   const dataCount = await prisma.product.count();

// //   return {
// //     data,
// //     totalPages: Math.ceil(dataCount / limit),
// //   };
// // }

// // //Delete a product
// // export async function deleteProduct(id: string) {
// //   try {
// //     const productExits = await prisma.product.findFirst({
// //       where: { id },
// //     });

// //     if (!productExits) throw new Error("Product not found");

// //     await prisma.product.delete({ where: { id } });

// //     revalidatePath("/admin/product");

// //     return {
// //       success: true,
// //       message: "Product deleted successfully",
// //     };
// //   } catch (error) {
// //     return {
// //       success: false,
// //       message: formatError(error),
// //     };
// //   }
// // }

// // // Create a product
// // export async function createProduct(data: z.infer<typeof insterProductSchema>) {
// //   try {
// //     const product = insterProductSchema.parse(data);
// //     await prisma.product.create({ data: product });

// //     revalidatePath("/admin/products");

// //     return {
// //       success: true,
// //       message: "Product created successfully",
// //     };
// //   } catch (error) {
// //     return {
// //       success: false,
// //       message: formatError(error),
// //     };
// //   }
// // }

// // // Update a product
// // export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
// //   try {
// //     const product = updateProductSchema.parse(data);
// //     const productExist = await prisma.product.findFirst({
// //       where: { id: product.id },
// //     });

// //     if (!productExist) throw new Error("Product not found");

// //     await prisma.product.update({
// //       where: { id: product.id },
// //       data: product,
// //     });

// //     revalidatePath("/admin/products");

// //     return {
// //       success: true,
// //       message: "Product updated successfully",
// //     };
// //   } catch (error) {
// //     return {
// //       success: false,
// //       message: formatError(error),
// //     };
// //   }
// // }

// // //Get product by Category
// // export async function getAllCategories() {
// //   const data = await prisma.product.groupBy({
// //     by: ["category"],
// //     _count: true,
// //   });

// //   return data;
// // }

// // //Get faetured products
// // export async function getFeaturedProducts() {
// //   const data = await prisma.product.findMany({
// //     where: { isFeatured: true },
// //     orderBy: { createdAt: "desc" },
// //     take: 4,
// //   });

// //   return converToPlainObject(data);
// // }
