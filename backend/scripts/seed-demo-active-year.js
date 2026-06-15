const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const USER = {
  email: 'demo.graficos@example.com',
  username: 'demo_graficos',
  password: 'Demo123456',
};

const taskThemes = [
  'Planificar sprint',
  'Diseñar pantalla',
  'Revisar documentación',
  'Preparar entrega',
  'Validar métricas',
  'Refinar interfaz',
  'Escribir memoria',
  'Probar flujo',
  'Organizar backlog',
  'Revisar feedback',
  'Optimizar rendimiento',
  'Preparar demo',
];

function dateAt(year, month, day, hour, minute = 0) {
  return new Date(year, month, day, hour, minute, 0, 0);
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function isWorkingDemoDay(year, month, day) {
  const date = dateAt(year, month, day, 9);
  const dow = date.getDay();
  if (dow === 0) return false;
  if (dow === 6) return day % 2 === 0;
  return true;
}

async function main() {
  const passwordHash = await bcrypt.hash(USER.password, 10);

  const existing = await prisma.user.findUnique({
    where: { username: USER.username },
    select: { id: true },
  });

  if (existing) {
    await prisma.refreshToken.deleteMany({ where: { userId: existing.id } });
    await prisma.focusSession.deleteMany({ where: { userId: existing.id } });
    await prisma.userInventory.deleteMany({ where: { userId: existing.id } });
    await prisma.userPreferences.deleteMany({ where: { userId: existing.id } });
    await prisma.userXP.deleteMany({ where: { userId: existing.id } });
    await prisma.streak.deleteMany({ where: { userId: existing.id } });
    await prisma.task.deleteMany({ where: { userId: existing.id } });
    await prisma.user.delete({ where: { id: existing.id } });
  }

  const user = await prisma.user.create({
    data: {
      email: USER.email,
      username: USER.username,
      passwordHash,
      createdAt: dateAt(2026, 0, 1, 8),
      updatedAt: new Date(),
    },
  });

  let taskCount = 0;
  let subtaskCount = 0;
  let focusMinutes = 0;
  let activeDays = 0;
  const taskRows = [];
  const focusRows = [];

  for (let month = 0; month < 12; month++) {
    const dim = daysInMonth(2026, month);
    for (let day = 1; day <= dim; day++) {
      if (!isWorkingDemoDay(2026, month, day)) continue;

      const intensity = ((month + day) % 5) + 1;
      const sessionsToday = intensity >= 4 ? 2 : 1;
      const tasksToday = intensity >= 5 ? 2 : 1;
      activeDays++;

      for (let s = 0; s < sessionsToday; s++) {
        const durationMin = 25 + ((month * 7 + day * 3 + s * 10) % 4) * 15;
        const startedAt = dateAt(2026, month, day, s === 0 ? 9 : 16, s === 0 ? 15 : 0);
        const endedAt = new Date(startedAt.getTime() + durationMin * 60 * 1000);
        focusMinutes += durationMin;
        focusRows.push({
          userId: user.id,
          durationMin,
          startedAt,
          endedAt,
          completed: true,
          createdAt: startedAt,
          updatedAt: endedAt,
        });
      }

      for (let t = 0; t < tasksToday; t++) {
        const completedAt = dateAt(2026, month, day, 17, 20 + t);
        const createdAt = dateAt(2026, month, Math.max(1, day - 2), 8, 30 + t);
        const title = `${taskThemes[(month + day + t) % taskThemes.length]} ${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}`;
        const subCount = 3 + ((month + day + t) % 4);
        taskRows.push({
          title,
          description: 'Actividad demo para mostrar estadísticas anuales.',
          completed: true,
          completedAt,
          dueDate: completedAt,
          userId: user.id,
          createdAt,
          updatedAt: completedAt,
          subtasks: Array.from({ length: subCount }, (_, i) => ({
            title: `Paso ${i + 1}: ${['analizar', 'crear', 'revisar', 'ajustar', 'validar', 'cerrar'][i % 6]}`,
            completed: true,
            order: i,
            createdAt,
            updatedAt: dateAt(2026, month, day, 11 + i, (i * 7) % 60),
          })),
        });
        taskCount++;
        subtaskCount += subCount;
      }
    }
  }

  const createdTasks = [];
  for (const row of taskRows) {
    const { subtasks, ...taskData } = row;
    const task = await prisma.task.create({
      data: {
        ...taskData,
        subtasks: { create: subtasks },
      },
      select: { id: true },
    });
    createdTasks.push(task.id);
  }

  await prisma.focusSession.createMany({ data: focusRows });

  // Link roughly half of the focus sessions to tasks so task detail views also look alive.
  const sessions = await prisma.focusSession.findMany({
    where: { userId: user.id },
    orderBy: { startedAt: 'asc' },
    select: { id: true },
  });
  for (let i = 0; i < sessions.length; i++) {
    if (i % 2 === 0) {
      await prisma.focusSession.update({
        where: { id: sessions[i].id },
        data: { taskId: createdTasks[i % createdTasks.length] },
      });
    }
  }

  await prisma.userXP.create({
    data: {
      userId: user.id,
      totalXp: taskCount * 50 + subtaskCount * 20 + Math.floor(focusMinutes / 5),
      coins: 1250,
      createdAt: dateAt(2026, 0, 1, 8),
      updatedAt: new Date(),
    },
  });

  await prisma.streak.create({
    data: {
      userId: user.id,
      currentStreak: 15,
      longestStreak: 46,
      lastActiveDate: dateAt(2026, 5, 15, 12),
      createdAt: dateAt(2026, 0, 1, 8),
      updatedAt: new Date(),
    },
  });

  await prisma.userPreferences.create({
    data: {
      userId: user.id,
      iconColor: 'icon_blue',
      theme: 'theme_blue',
    },
  });

  console.log(`Demo user created: ${USER.username} / ${USER.password}`);
  console.log(`Email: ${USER.email}`);
  console.log(`Tasks: ${taskCount}`);
  console.log(`Subtasks: ${subtaskCount}`);
  console.log(`Focus sessions: ${focusRows.length}`);
  console.log(`Focus minutes: ${focusMinutes}`);
  console.log(`Active days in 2026: ${activeDays}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
