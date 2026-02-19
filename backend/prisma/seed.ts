import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // ─────────────────────────────────────────────
  // CLEAR EXISTING DATA (order matters for FK constraints)
  // ─────────────────────────────────────────────
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.b2BProfile.deleteMany();
  await prisma.adminProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.storeSetting.deleteMany();

  console.log('🧹 Cleared existing data');

  // ─────────────────────────────────────────────
  // STORE SETTINGS
  // ─────────────────────────────────────────────
  await prisma.storeSetting.create({
    data: {
      storeName: 'Center-ElSayad',
      contactEmail: 'info@center-elsayad.com',
      contactPhone: '+20 100 000 0000',
      b2bDiscountPercent: 20.0,
      shippingFlatRate: 50.0,
      freeShippingThreshold: 500.0,
      taxPercent: 14.0,
    },
  });
  console.log('⚙️  Store settings created');

  // ─────────────────────────────────────────────
  // USERS
  // ─────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('password123', 12);

  // Super Admin
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@center-elsayad.com',
      passwordHash,
      firstName: 'Super',
      lastName: 'Admin',
      phone: '+20 100 000 0001',
      userType: 'ADMIN',
      adminProfile: {
        create: { role: 'SUPER_ADMIN' },
      },
    },
  });

  // B2C Customer
  const b2cUser = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      passwordHash,
      firstName: 'Ahmed',
      lastName: 'Hassan',
      phone: '+20 100 000 0002',
      userType: 'B2C',
      addresses: {
        create: {
          label: 'Home',
          fullName: 'Ahmed Hassan',
          phone: '+20 100 000 0002',
          street: '15 Tahrir Square',
          city: 'Cairo',
          country: 'Egypt',
          isDefault: true,
        },
      },
    },
  });

  // B2B Customer (Approved)
  const b2bUser = await prisma.user.create({
    data: {
      email: 'store@example.com',
      passwordHash,
      firstName: 'Mohamed',
      lastName: 'Ali',
      phone: '+20 100 000 0003',
      userType: 'B2B',
      b2bProfile: {
        create: {
          businessName: 'Ali Stationery Store',
          taxId: 'TAX-123456789',
          businessAddress: '7 Nasr City, Cairo, Egypt',
          contactPerson: 'Mohamed Ali',
          status: 'APPROVED',
          discountPercent: 20.0,
          reviewedBy: superAdmin.id,
          reviewedAt: new Date(),
        },
      },
      addresses: {
        create: {
          label: 'Store',
          fullName: 'Mohamed Ali',
          phone: '+20 100 000 0003',
          street: '7 Nasr City',
          city: 'Cairo',
          country: 'Egypt',
          isDefault: true,
        },
      },
    },
  });

  console.log('👥 Users created:');
  console.log(`   Admin → ${superAdmin.email}`);
  console.log(`   B2C   → ${b2cUser.email}`);
  console.log(`   B2B   → ${b2bUser.email}`);
  console.log('   Password for all: password123');

  // ─────────────────────────────────────────────
  // CATEGORIES
  // ─────────────────────────────────────────────
  const [officeSupplies, schoolSupplies, educationalBooks, toysGames] =
    await Promise.all([
      prisma.category.create({
        data: {
          name: 'Office Supplies',
          slug: 'office-supplies',
          description: 'Everything you need for a productive office environment',
          sortOrder: 1,
        },
      }),
      prisma.category.create({
        data: {
          name: 'School Supplies',
          slug: 'school-supplies',
          description: 'Notebooks, pens, and everything students need',
          sortOrder: 2,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Educational Books',
          slug: 'educational-books',
          description: 'Textbooks, workbooks, and learning materials',
          sortOrder: 3,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Toys & Games',
          slug: 'toys-and-games',
          description: 'Educational toys and games for kids of all ages',
          sortOrder: 4,
        },
      }),
    ]);

  console.log('📂 Categories created: Office Supplies, School Supplies, Educational Books, Toys & Games');

  // ─────────────────────────────────────────────
  // PRODUCTS
  // ─────────────────────────────────────────────
  const products = await Promise.all([
    // Office Supplies
    prisma.product.create({
      data: {
        categoryId: officeSupplies.id,
        name: 'Heavy Duty Stapler',
        slug: 'heavy-duty-stapler',
        description: 'Professional stapler, handles up to 50 sheets. Ideal for office use.',
        retailPrice: 120.00,
        stockQuantity: 85,
        isFeatured: true,
        images: { create: [{ url: 'https://placehold.co/400x400?text=Stapler', sortOrder: 0 }] },
      },
    }),
    prisma.product.create({
      data: {
        categoryId: officeSupplies.id,
        name: 'Whiteboard Markers Set (12 Colors)',
        slug: 'whiteboard-markers-12-colors',
        description: 'Dry-erase markers in 12 vibrant colors. Low odor formula.',
        retailPrice: 85.00,
        stockQuantity: 200,
        isFeatured: false,
        images: { create: [{ url: 'https://placehold.co/400x400?text=Markers', sortOrder: 0 }] },
      },
    }),
    prisma.product.create({
      data: {
        categoryId: officeSupplies.id,
        name: 'A4 Copy Paper (500 Sheets)',
        slug: 'a4-copy-paper-500',
        description: '80 gsm A4 white copy paper, suitable for all printers and copiers.',
        retailPrice: 65.00,
        stockQuantity: 500,
        isFeatured: true,
        images: { create: [{ url: 'https://placehold.co/400x400?text=A4+Paper', sortOrder: 0 }] },
      },
    }),

    // School Supplies
    prisma.product.create({
      data: {
        categoryId: schoolSupplies.id,
        name: 'A4 Spiral Notebook (200 Pages)',
        slug: 'a4-spiral-notebook-200-pages',
        description: 'Durable spiral-bound notebook with 200 ruled pages. Perfect for students.',
        retailPrice: 35.00,
        stockQuantity: 350,
        isFeatured: true,
        images: { create: [{ url: 'https://placehold.co/400x400?text=Notebook', sortOrder: 0 }] },
      },
    }),
    prisma.product.create({
      data: {
        categoryId: schoolSupplies.id,
        name: 'Colored Pencils Set (24 Colors)',
        slug: 'colored-pencils-24-colors',
        description: 'High-quality colored pencils with smooth, vibrant pigments.',
        retailPrice: 45.00,
        stockQuantity: 180,
        isFeatured: false,
        images: { create: [{ url: 'https://placehold.co/400x400?text=Pencils', sortOrder: 0 }] },
      },
    }),
    prisma.product.create({
      data: {
        categoryId: schoolSupplies.id,
        name: 'Clear Ruler 30cm',
        slug: 'clear-ruler-30cm',
        description: 'Transparent ruler with metric and imperial markings.',
        retailPrice: 10.00,
        stockQuantity: 400,
        isFeatured: false,
        images: { create: [{ url: 'https://placehold.co/400x400?text=Ruler', sortOrder: 0 }] },
      },
    }),

    // Educational Books
    prisma.product.create({
      data: {
        categoryId: educationalBooks.id,
        name: 'Mathematics Workbook - Grade 5',
        slug: 'mathematics-workbook-grade-5',
        description: 'Comprehensive math workbook covering all Grade 5 topics.',
        retailPrice: 95.00,
        stockQuantity: 120,
        isFeatured: true,
        images: { create: [{ url: 'https://placehold.co/400x400?text=Math+Book', sortOrder: 0 }] },
      },
    }),
    prisma.product.create({
      data: {
        categoryId: educationalBooks.id,
        name: 'Arabic Language Workbook - Grade 3',
        slug: 'arabic-language-workbook-grade-3',
        description: 'Arabic grammar and writing workbook for Grade 3 students.',
        retailPrice: 80.00,
        stockQuantity: 95,
        isFeatured: false,
        images: { create: [{ url: 'https://placehold.co/400x400?text=Arabic+Book', sortOrder: 0 }] },
      },
    }),

    // Toys & Games
    prisma.product.create({
      data: {
        categoryId: toysGames.id,
        name: 'Wooden Building Blocks (100 Pieces)',
        slug: 'wooden-building-blocks-100-pieces',
        description: 'Natural wood blocks in various shapes. Develops creativity. Ages 3+.',
        retailPrice: 250.00,
        stockQuantity: 60,
        isFeatured: true,
        images: { create: [{ url: 'https://placehold.co/400x400?text=Blocks', sortOrder: 0 }] },
      },
    }),
    prisma.product.create({
      data: {
        categoryId: toysGames.id,
        name: 'Educational Puzzle - World Map (100 Pieces)',
        slug: 'educational-puzzle-world-map',
        description: 'Colorful world map jigsaw puzzle with country names. Ages 6+.',
        retailPrice: 180.00,
        stockQuantity: 75,
        isFeatured: true,
        images: { create: [{ url: 'https://placehold.co/400x400?text=Puzzle', sortOrder: 0 }] },
      },
    }),
  ]);

  console.log(`📦 ${products.length} products created`);

  // ─────────────────────────────────────────────
  // SAMPLE REVIEWS
  // ─────────────────────────────────────────────
  await prisma.review.createMany({
    data: [
      {
        userId: b2cUser.id,
        productId: products[0].id,
        rating: 5,
        comment: 'Excellent quality! Very sturdy and handles thick stacks easily.',
      },
      {
        userId: b2cUser.id,
        productId: products[3].id,
        rating: 4,
        comment: 'Good quality notebook, pages are smooth. Would buy again.',
      },
    ],
  });

  console.log('⭐ Sample reviews created');
  console.log('\n✅ Seed completed successfully!\n');
  console.log('────────────────────────────────────────');
  console.log('🔑 Test Accounts (password: password123)');
  console.log('   Admin → admin@center-elsayad.com');
  console.log('   B2C   → customer@example.com');
  console.log('   B2B   → store@example.com');
  console.log('────────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
