// seed_menu.js
import { PrismaClient } from './generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
  console.log('Начинаем заполнение (seeding) меню...');

  // --- 1. ОЧИСТИМ СТАРОЕ МЕНЮ (чтобы не было дублей) ---
  // Важно: Мы удаляем в обратном порядке (сначала Продукты, потом Категории)
  await prisma.product.deleteMany({});
  await prisma.productCategory.deleteMany({});
  console.log('Старое меню очищено.');

  // --- 2. СОЗДАЕМ КАТЕГОРИИ И ПРОДУКТЫ (одним запросом) ---

  const category1 = await prisma.productCategory.create({
    data: {
      name: 'Классические Роллы',
      products: {
        create: [
          {
            name: 'Ролл Филадельфия',
            description: 'Лосось, сливочный сыр, огурец',
            price: 12.5,
          },
          {
            name: 'Ролл Калифорния',
            description: 'Краб, авокадо, огурец, тобико',
            price: 10.0,
          },
        ],
      },
    },
  });

  const category2 = await prisma.productCategory.create({
    data: {
      name: 'Сеты',
      products: {
        create: [
          {
            name: 'Сет "Гранд"',
            description: 'Филадельфия, Калифорния, Дракон (24 шт.)',
            price: 35.0,
          },
          {
            name: 'Сет "Дуэт"',
            description: 'Два горячих ролла (16 шт.)',
            price: 22.0,
          },
        ],
      },
    },
  });

  // --- 3. (ПРИМЕР) Добавим Картошку для Апселла ---
  const category3 = await prisma.productCategory.create({
    data: {
      name: 'Допы / Апселл',
      products: {
        create: [
          {
            id: 123, // !! Указываем ID вручную (123)
            name: 'Картошка Фри (Скидка 30%)',
            description: 'Специальное предложение к заказу',
            price: 3.5,
          },
        ],
      },
    },
  });

  console.log(`✅ Меню заполнено!`);
  console.log(`  - Создана категория: ${category1.name}`);
  console.log(`  - Создана категория: ${category2.name}`);
  console.log(`  - Создана категория (апселл): ${category3.name} (ID продукта: 123)`);
}

main()
  .catch((e) => {
    console.error('Ошибка при заполнении меню:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });