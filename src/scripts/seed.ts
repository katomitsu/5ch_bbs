import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 掲示板のシード
  const boards = [
    {
      name: 'general',
      description: '雑談用の掲示板です。何でも話せます。',
    },
    {
      name: 'tech',
      description: '技術的な話題の掲示板です。',
    },
    {
      name: 'news',
      description: 'ニュースについて話す掲示板です。',
    },
  ];

  console.log(`Start seeding boards...`);
  for (const board of boards) {
    const existingBoard = await prisma.board.findUnique({
      where: { name: board.name },
    });

    if (!existingBoard) {
      const createdBoard = await prisma.board.create({
        data: board,
      });
      console.log(`Created board: ${createdBoard.name}`);
    } else {
      console.log(`Board ${board.name} already exists`);
    }
  }

  // generalボードにスレッドとポストを追加
  const generalBoard = await prisma.board.findUnique({
    where: { name: 'general' },
  });

  if (generalBoard) {
    // サンプルスレッド1
    const thread1 = await prisma.thread.create({
      data: {
        title: 'はじめましてのスレッド',
        boardId: generalBoard.id,
      },
    });

    await prisma.post.create({
      data: {
        threadId: thread1.id,
        name: '名無しさん',
        body: 'こんにちは。このサイトでは自由に書き込みができます。',
        ipHash: 'sample1',
      },
    });

    await prisma.post.create({
      data: {
        threadId: thread1.id,
        name: '名無しさん',
        body: 'よろしくお願いします！',
        ipHash: 'sample2',
      },
    });

    // サンプルスレッド2
    const thread2 = await prisma.thread.create({
      data: {
        title: '好きな食べ物について語るスレ',
        boardId: generalBoard.id,
      },
    });

    await prisma.post.create({
      data: {
        threadId: thread2.id,
        name: 'グルメ',
        body: '皆さん、好きな食べ物は何ですか？私はラーメンが好きです。',
        ipHash: 'sample3',
      },
    });

    console.log(`Created sample threads and posts on general board`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });