import { useEffect, useRef } from 'react';
import { Habit } from '@/types/habit';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/contexts/LanguageContext';

export function useHabitNotifications(habits: Habit[]) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const hasShownRef = useRef(false);

  useEffect(() => {
    // Only show notifications once per session
    if (hasShownRef.current || habits.length === 0) return;

    const today = new Date().toISOString().split('T')[0];
    const dayOfWeek = new Date().getDay();
    
    // Find habits due today that are not completed
    const todayHabits = habits.filter(h => 
      h.targetDays.includes(dayOfWeek) && 
      !h.completedDates.includes(today)
    );

    // Find habits with long streaks (celebrate)
    const habitsWithStreaks = habits.filter(h => h.streak >= 7);

    let delay = 500;

    // Show reminder for today's habits
    if (todayHabits.length > 0) {
      setTimeout(() => {
        toast({
          title: `🎯 ${t('habitsReminder') || 'Привычки на сегодня'}`,
          description: `${todayHabits.length} ${t('habitsToComplete') || 'привычек ждут выполнения'}`,
        });
      }, delay);
      delay += 1500;
    }

    // Celebrate streaks
    if (habitsWithStreaks.length > 0) {
      setTimeout(() => {
        const longestStreak = Math.max(...habitsWithStreaks.map(h => h.streak));
        toast({
          title: `🔥 ${t('streakCelebration') || 'Отличная серия!'}`,
          description: `${t('longestStreak') || 'Лучшая серия'}: ${longestStreak} ${t('days') || 'дней'}`,
        });
      }, delay);
    }

    hasShownRef.current = true;
  }, [habits, toast, t]);
}
