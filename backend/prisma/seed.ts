import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

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

  // B2B Customer (Approved) -> Converted to B2C
  const b2bUser = await prisma.user.create({
    data: {
      email: 'store@example.com',
      passwordHash,
      firstName: 'Mohamed',
      lastName: 'Ali',
      phone: '+20 100 000 0003',
      userType: 'B2C',
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
  const dummyProductsData = [
    // Office Supplies
    { categoryId: officeSupplies.id, name: 'Heavy Duty Stapler', desc: 'Professional stapler, handles up to 50 sheets.', price: 120, stock: 85, feat: true },
    { categoryId: officeSupplies.id, name: 'Whiteboard Markers Set', desc: '12 vibrant colors. Low odor.', price: 85, stock: 200, feat: false },
    { categoryId: officeSupplies.id, name: 'A4 Copy Paper (500 Sheets)', desc: '80 gsm A4 white copy paper.', price: 65, stock: 500, feat: true },
    { categoryId: officeSupplies.id, name: 'Ergonomic Office Chair', desc: 'Lumbar support and breathable mesh.', price: 2500, stock: 25, feat: true },
    { categoryId: officeSupplies.id, name: 'Wireless Ergonomic Mouse', desc: 'Reduces wrist strain. Long battery life.', price: 450, stock: 60, feat: false },
    { categoryId: officeSupplies.id, name: 'Mechanical Keyboard (Brown Switches)', desc: 'Tactile feel for typing productivity.', price: 1200, stock: 40, feat: false },
    { categoryId: officeSupplies.id, name: 'Desk Organizer Mesh', desc: 'Keep your pens and clips sorted.', price: 120, stock: 150, feat: false },
    { categoryId: officeSupplies.id, name: 'File Cabinet (3 Drawers)', desc: 'Lockable metal filing cabinet.', price: 1800, stock: 15, feat: false },
    { categoryId: officeSupplies.id, name: 'Gel Pen Pack (10 Black)', desc: 'Smooth writing gel pens.', price: 50, stock: 300, feat: false },
    { categoryId: officeSupplies.id, name: 'Correction Fluid (3 Pack)', desc: 'Fast drying white-out.', price: 45, stock: 250, feat: false },

    // School Supplies
    { categoryId: schoolSupplies.id, name: 'A4 Spiral Notebook (200 Pages)', desc: 'Durable notebook for students.', price: 35, stock: 350, feat: true },
    { categoryId: schoolSupplies.id, name: 'Colored Pencils Set (24)', desc: 'High-quality pigments.', price: 45, stock: 180, feat: false },
    { categoryId: schoolSupplies.id, name: 'Clear Ruler 30cm', desc: 'Transparent ruler with metric markings.', price: 10, stock: 400, feat: false },
    { categoryId: schoolSupplies.id, name: 'Scientific Calculator classwiz', desc: 'advanced functions for high school.', price: 550, stock: 120, feat: true },
    { categoryId: schoolSupplies.id, name: 'Geometry Set', desc: 'Compass, protractor, and rulers in a tin case.', price: 85, stock: 200, feat: false },
    { categoryId: schoolSupplies.id, name: 'Highlighter Pack (5 Colors)', desc: 'Chisel tip fluorescent highlighters.', price: 60, stock: 320, feat: false },
    { categoryId: schoolSupplies.id, name: 'Eraser Set (4 Pack)', desc: 'Dust-free soft erasers.', price: 20, stock: 500, feat: false },
    { categoryId: schoolSupplies.id, name: 'Pencil Case (Large Capacity)', desc: 'Multiple compartments for all stationery.', price: 150, stock: 90, feat: true },
    { categoryId: schoolSupplies.id, name: 'Sticky Notes (Neon Colors)', desc: '3x3 inch, 4 pads.', price: 40, stock: 450, feat: false },
    { categoryId: schoolSupplies.id, name: 'Backpack (Water Resistant)', desc: 'Spacious compartments for books and laptops.', price: 650, stock: 50, feat: true },

    // Educational Books
    { categoryId: educationalBooks.id, name: 'Mathematics Workbook - Grade 5', desc: 'Comprehensive math exercises.', price: 95, stock: 120, feat: true },
    { categoryId: educationalBooks.id, name: 'Arabic Language Workbook - Grade 3', desc: 'Arabic grammar and writing.', price: 80, stock: 95, feat: false },
    { categoryId: educationalBooks.id, name: 'Physics For Beginners', desc: 'An introductory guide to classical mechanics.', price: 150, stock: 70, feat: true },
    { categoryId: educationalBooks.id, name: 'World History Atlas', desc: 'Detailed maps and historical events.', price: 220, stock: 45, feat: false },
    { categoryId: educationalBooks.id, name: 'English Grammar in Use', desc: 'Self-study reference and practice book.', price: 300, stock: 65, feat: true },
    { categoryId: educationalBooks.id, name: 'Biology Fundamentals', desc: 'Cellular biology and genetics explained.', price: 180, stock: 80, feat: false },
    { categoryId: educationalBooks.id, name: 'Periodic Table Poster', desc: 'Laminated large periodic table.', price: 50, stock: 150, feat: false },
    { categoryId: educationalBooks.id, name: 'French Dictionary', desc: 'French-English translation dictionary.', price: 120, stock: 110, feat: false },
    { categoryId: educationalBooks.id, name: 'Programming in Python 101', desc: 'Learn algorithms and data structures.', price: 250, stock: 55, feat: true },
    { categoryId: educationalBooks.id, name: 'Art History Overview', desc: 'From Renaissance to Modern Art.', price: 280, stock: 30, feat: false },

    // Toys & Games
    { categoryId: toysGames.id, name: 'Wooden Building Blocks (100 Pcs)', desc: 'Natural wood blocks. Ages 3+.', price: 250, stock: 60, feat: true },
    { categoryId: toysGames.id, name: 'Educational Puzzle - World Map', desc: 'Colorful world map jigsaw puzzle.', price: 180, stock: 75, feat: true },
    { categoryId: toysGames.id, name: 'Rubik\'s Cube 3x3', desc: 'Classic color-matching puzzle.', price: 90, stock: 140, feat: false },
    { categoryId: toysGames.id, name: 'Chemistry Set for Kids', desc: 'Safe experiments for young scientists.', price: 450, stock: 40, feat: true },
    { categoryId: toysGames.id, name: 'Lego Creator Robot', desc: '3-in-1 building set.', price: 650, stock: 25, feat: true },
    { categoryId: toysGames.id, name: 'Board Game: Settlers of Catan', desc: 'Strategy trading game.', price: 850, stock: 15, feat: false },
    { categoryId: toysGames.id, name: 'Magnetic Tiles Set (60 Pcs)', desc: 'Creative building tiles.', price: 350, stock: 50, feat: false },
    { categoryId: toysGames.id, name: 'Plush Toy Elephant', desc: 'Soft and cuddly companion.', price: 200, stock: 85, feat: false },
    { categoryId: toysGames.id, name: 'Remote Control Car', desc: 'Off-road 4x4 RC car.', price: 550, stock: 35, feat: true },
    { categoryId: toysGames.id, name: 'Play-Doh Mega Pack', desc: '20 colors of modeling compound.', price: 280, stock: 65, feat: false },
  ];

  const products = await Promise.all(
    dummyProductsData.map((p, i) => {
      const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + i;
      return prisma.product.create({
        data: {
          categoryId: p.categoryId,
          name: p.name,
          slug: slug,
          description: p.desc,
          retailPrice: p.price,
          stockQuantity: p.stock,
          isFeatured: p.feat,
          images: {
            create: [
              {
                url: `https://placehold.co/400x400?text=${encodeURIComponent(p.name.split(' ')[0])}`,
                sortOrder: 0
              }
            ]
          }
        }
      });
    })
  );

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
