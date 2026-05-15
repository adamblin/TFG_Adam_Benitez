import { Injectable } from '@nestjs/common';

export type NotificationContext = {
  currentStreak: number;
  isNewRecord: boolean;
  sessionsToday: number;
};

@Injectable()
export class NotificationsService {
  getSessionCompleteMessage(ctx: NotificationContext): string {
    const { currentStreak, isNewRecord, sessionsToday } = ctx;

    if (isNewRecord && currentStreak > 1) {
      return `New record! ${currentStreak} day streak — you are unstoppable!`;
    }
    if (currentStreak >= 30) {
      return `${currentStreak} days in a row. Absolute consistency. Keep going!`;
    }
    if (currentStreak >= 7) {
      return `${currentStreak} day streak! You are building a real habit!`;
    }
    if (currentStreak >= 3) {
      return `${currentStreak} days in a row! Momentum is everything.`;
    }
    if (sessionsToday > 1) {
      return `${sessionsToday} sessions today — great focus block!`;
    }
    return `Focus session complete! Every session counts.`;
  }
}
