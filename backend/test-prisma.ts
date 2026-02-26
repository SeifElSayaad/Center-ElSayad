import prisma from './src/lib/prisma';
async function test() {
  try {
    await prisma.category.findMany();
    console.log("Success");
  } catch (err) {
    console.error("Prisma Error:", err);
  }
}
test();
