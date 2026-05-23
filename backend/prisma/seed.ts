import { PrismaClient, PhraseCategory } from '@prisma/client';

const prisma = new PrismaClient();

const phrases: { text: string; category: PhraseCategory }[] = [
  // ── TASK ─────────────────────────────────────────────────────────────────────
  { category: 'TASK', text: 'Task complete! Every small win builds the path to your goals.' },
  { category: 'TASK', text: 'Done! Consistency beats perfection every single time.' },
  { category: 'TASK', text: 'Another task down. You are building real momentum.' },
  { category: 'TASK', text: 'Completed! Action is the antidote to procrastination.' },
  { category: 'TASK', text: 'Great work! Progress, no matter how small, always counts.' },
  { category: 'TASK', text: 'Finished! The discipline you show today shapes your tomorrow.' },
  { category: 'TASK', text: 'Task crossed off! Success is just a series of completed tasks.' },
  { category: 'TASK', text: 'Well done! You are one step closer to where you want to be.' },
  { category: 'TASK', text: 'Done and dusted! Keep showing up — it adds up.' },
  { category: 'TASK', text: 'Excellent! You proved today that you are capable.' },
  { category: 'TASK', text: 'Task complete! The hardest part is starting — and you did.' },
  { category: 'TASK', text: 'Great job! Every completed task is a vote for the person you are becoming.' },
  { category: 'TASK', text: 'Fantastic! You are building real habits, one task at a time.' },
  { category: 'TASK', text: 'Done! Your future self will thank you for this.' },
  { category: 'TASK', text: 'Accomplished! Focused effort always pays off.' },
  { category: 'TASK', text: 'You did it! Discipline creates the freedom you deserve.' },
  { category: 'TASK', text: 'Task complete! Show up every day and watch yourself grow.' },
  { category: 'TASK', text: 'Brilliant! The secret is to just get started — you already did.' },

  // ── SUBTASK ───────────────────────────────────────────────────────────────────
  { category: 'SUBTASK', text: 'Step done! Every piece of the puzzle matters.' },
  { category: 'SUBTASK', text: 'Progress! Breaking things into steps is wisdom in action.' },
  { category: 'SUBTASK', text: 'One step forward. Keep the momentum going!' },
  { category: 'SUBTASK', text: 'Nice work! Small steps lead to big destinations.' },
  { category: 'SUBTASK', text: 'Step completed! You are unstoppable when you focus.' },
  { category: 'SUBTASK', text: 'Little by little, you are getting there.' },
  { category: 'SUBTASK', text: 'Another piece placed. The full picture is coming together.' },
  { category: 'SUBTASK', text: 'Detail work is real work. Great job!' },
  { category: 'SUBTASK', text: 'Step by step, you are making it happen.' },
  { category: 'SUBTASK', text: 'Subtask done! Persistence always wins in the end.' },
  { category: 'SUBTASK', text: 'One less thing to worry about. You are on a roll!' },
  { category: 'SUBTASK', text: 'Keep chipping away — you are almost there.' },
  { category: 'SUBTASK', text: 'Every step forward is progress, no matter the size.' },
  { category: 'SUBTASK', text: 'Breaking things down and conquering them is a superpower.' },
  { category: 'SUBTASK', text: 'Step complete! The journey of a thousand miles continues.' },
  { category: 'SUBTASK', text: 'Solid work! Each subtask is proof you are taking action.' },
  { category: 'SUBTASK', text: 'Done! You are closer than you were one minute ago.' },
  { category: 'SUBTASK', text: 'Step by step — that is how mountains are moved.' },

  // ── FOCUS ─────────────────────────────────────────────────────────────────────
  { category: 'FOCUS', text: 'Focus session complete! Deep work is your superpower.' },
  { category: 'FOCUS', text: 'You stayed focused — that is where real growth happens.' },
  { category: 'FOCUS', text: 'Session done! Distractions tried, but you won.' },
  { category: 'FOCUS', text: 'Great session! Your future self is grateful for this.' },
  { category: 'FOCUS', text: 'You just trained your mind like a muscle. Well done!' },
  { category: 'FOCUS', text: 'Deep work complete. This is how goals are truly achieved.' },
  { category: 'FOCUS', text: 'You showed up and stayed focused. That is everything.' },
  { category: 'FOCUS', text: 'Concentration is the new currency — and you just earned it.' },
  { category: 'FOCUS', text: 'Quality focus time always beats quantity. Session complete!' },
  { category: 'FOCUS', text: 'Every focused minute compounds over time. Keep going!' },
  { category: 'FOCUS', text: 'You protected your attention — that is rare and powerful.' },
  { category: 'FOCUS', text: 'Focused effort moves mountains. Session complete!' },
  { category: 'FOCUS', text: 'Flow state unlocked. Progress is inevitable now.' },
  { category: 'FOCUS', text: 'Deep work done. The discipline today shapes your tomorrow.' },
  { category: 'FOCUS', text: 'Session complete! You are building the habit of excellence.' },
  { category: 'FOCUS', text: 'You did the work when it mattered most. That is real strength.' },
  { category: 'FOCUS', text: 'Brilliant session! Focused time is the ultimate investment.' },
  { category: 'FOCUS', text: 'Session done! Every block of focus gets you closer to mastery.' },
];

async function main() {
  console.log('Seeding motivational phrases…');
  await prisma.motivationalPhrase.createMany({ data: phrases, skipDuplicates: true });
  console.log(`✓ ${phrases.length} phrases seeded.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
