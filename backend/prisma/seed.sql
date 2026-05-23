-- Create enum type if it doesn't exist
DO $$ BEGIN
  CREATE TYPE "PhraseCategory" AS ENUM ('TASK', 'SUBTASK', 'FOCUS');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

INSERT INTO motivational_phrases (id, text, category, "createdAt") VALUES
-- TASK
(gen_random_uuid(), 'Task complete! Every small win builds the path to your goals.', 'TASK', NOW()),
(gen_random_uuid(), 'Done! Consistency beats perfection every single time.', 'TASK', NOW()),
(gen_random_uuid(), 'Another task down. You are building real momentum.', 'TASK', NOW()),
(gen_random_uuid(), 'Completed! Action is the antidote to procrastination.', 'TASK', NOW()),
(gen_random_uuid(), 'Great work! Progress, no matter how small, always counts.', 'TASK', NOW()),
(gen_random_uuid(), 'Finished! The discipline you show today shapes your tomorrow.', 'TASK', NOW()),
(gen_random_uuid(), 'Task crossed off! Success is just a series of completed tasks.', 'TASK', NOW()),
(gen_random_uuid(), 'Well done! You are one step closer to where you want to be.', 'TASK', NOW()),
(gen_random_uuid(), 'Done and dusted! Keep showing up — it adds up.', 'TASK', NOW()),
(gen_random_uuid(), 'Excellent! You proved today that you are capable.', 'TASK', NOW()),
(gen_random_uuid(), 'Task complete! The hardest part is starting — and you did.', 'TASK', NOW()),
(gen_random_uuid(), 'Great job! Every completed task is a vote for who you are becoming.', 'TASK', NOW()),
(gen_random_uuid(), 'Fantastic! You are building real habits, one task at a time.', 'TASK', NOW()),
(gen_random_uuid(), 'Done! Your future self will thank you for this.', 'TASK', NOW()),
(gen_random_uuid(), 'Accomplished! Focused effort always pays off.', 'TASK', NOW()),
(gen_random_uuid(), 'You did it! Discipline creates the freedom you deserve.', 'TASK', NOW()),
(gen_random_uuid(), 'Task complete! Show up every day and watch yourself grow.', 'TASK', NOW()),
(gen_random_uuid(), 'Brilliant! The secret is to just get started — you already did.', 'TASK', NOW()),

-- SUBTASK
(gen_random_uuid(), 'Step done! Every piece of the puzzle matters.', 'SUBTASK', NOW()),
(gen_random_uuid(), 'Progress! Breaking things into steps is wisdom in action.', 'SUBTASK', NOW()),
(gen_random_uuid(), 'One step forward. Keep the momentum going!', 'SUBTASK', NOW()),
(gen_random_uuid(), 'Nice work! Small steps lead to big destinations.', 'SUBTASK', NOW()),
(gen_random_uuid(), 'Step completed! You are unstoppable when you focus.', 'SUBTASK', NOW()),
(gen_random_uuid(), 'Little by little, you are getting there.', 'SUBTASK', NOW()),
(gen_random_uuid(), 'Another piece placed. The full picture is coming together.', 'SUBTASK', NOW()),
(gen_random_uuid(), 'Detail work is real work. Great job!', 'SUBTASK', NOW()),
(gen_random_uuid(), 'Step by step, you are making it happen.', 'SUBTASK', NOW()),
(gen_random_uuid(), 'Subtask done! Persistence always wins in the end.', 'SUBTASK', NOW()),
(gen_random_uuid(), 'One less thing to worry about. You are on a roll!', 'SUBTASK', NOW()),
(gen_random_uuid(), 'Keep chipping away — you are almost there.', 'SUBTASK', NOW()),
(gen_random_uuid(), 'Every step forward is progress, no matter the size.', 'SUBTASK', NOW()),
(gen_random_uuid(), 'Breaking things down and conquering them is a superpower.', 'SUBTASK', NOW()),
(gen_random_uuid(), 'Step complete! The journey of a thousand miles continues.', 'SUBTASK', NOW()),
(gen_random_uuid(), 'Solid work! Each subtask is proof you are taking action.', 'SUBTASK', NOW()),
(gen_random_uuid(), 'Done! You are closer than you were one minute ago.', 'SUBTASK', NOW()),
(gen_random_uuid(), 'Step by step — that is how mountains are moved.', 'SUBTASK', NOW()),

-- FOCUS
(gen_random_uuid(), 'Focus session complete! Deep work is your superpower.', 'FOCUS', NOW()),
(gen_random_uuid(), 'You stayed focused — that is where real growth happens.', 'FOCUS', NOW()),
(gen_random_uuid(), 'Session done! Distractions tried, but you won.', 'FOCUS', NOW()),
(gen_random_uuid(), 'Great session! Your future self is grateful for this.', 'FOCUS', NOW()),
(gen_random_uuid(), 'You just trained your mind like a muscle. Well done!', 'FOCUS', NOW()),
(gen_random_uuid(), 'Deep work complete. This is how goals are truly achieved.', 'FOCUS', NOW()),
(gen_random_uuid(), 'You showed up and stayed focused. That is everything.', 'FOCUS', NOW()),
(gen_random_uuid(), 'Concentration is the new currency — and you just earned it.', 'FOCUS', NOW()),
(gen_random_uuid(), 'Quality focus time always beats quantity. Session complete!', 'FOCUS', NOW()),
(gen_random_uuid(), 'Every focused minute compounds over time. Keep going!', 'FOCUS', NOW()),
(gen_random_uuid(), 'You protected your attention — that is rare and powerful.', 'FOCUS', NOW()),
(gen_random_uuid(), 'Focused effort moves mountains. Session complete!', 'FOCUS', NOW()),
(gen_random_uuid(), 'Flow state unlocked. Progress is inevitable now.', 'FOCUS', NOW()),
(gen_random_uuid(), 'Deep work done. The discipline today shapes your tomorrow.', 'FOCUS', NOW()),
(gen_random_uuid(), 'Session complete! You are building the habit of excellence.', 'FOCUS', NOW()),
(gen_random_uuid(), 'You did the work when it mattered most. That is real strength.', 'FOCUS', NOW()),
(gen_random_uuid(), 'Brilliant session! Focused time is the ultimate investment.', 'FOCUS', NOW()),
(gen_random_uuid(), 'Session done! Every block of focus gets you closer to mastery.', 'FOCUS', NOW())

ON CONFLICT DO NOTHING;
