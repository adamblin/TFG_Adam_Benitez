import { NotificationsService } from './notifications.service';

describe('NotificationsService – getSessionCompleteMessage', () => {
  const service = new NotificationsService();

  it('returns new-record message when isNewRecord is true and streak > 1', () => {
    const msg = service.getSessionCompleteMessage({
      currentStreak: 8,
      isNewRecord: true,
      sessionsToday: 1,
    });
    expect(msg).toContain('New record');
    expect(msg).toContain('8');
  });

  it('does not return new-record message when isNewRecord is true but streak is 1', () => {
    const msg = service.getSessionCompleteMessage({
      currentStreak: 1,
      isNewRecord: true,
      sessionsToday: 1,
    });
    expect(msg).not.toContain('New record');
  });

  it('returns 30-day message for streaks >= 30', () => {
    const msg = service.getSessionCompleteMessage({
      currentStreak: 30,
      isNewRecord: false,
      sessionsToday: 1,
    });
    expect(msg).toContain('30');
    expect(msg).toContain('Absolute consistency');
  });

  it('returns 7-day message for streaks 7–29', () => {
    const msg = service.getSessionCompleteMessage({
      currentStreak: 7,
      isNewRecord: false,
      sessionsToday: 1,
    });
    expect(msg).toContain('7');
    expect(msg).toContain('habit');
  });

  it('returns 3-day message for streaks 3–6', () => {
    const msg = service.getSessionCompleteMessage({
      currentStreak: 3,
      isNewRecord: false,
      sessionsToday: 1,
    });
    expect(msg).toContain('3');
    expect(msg).toContain('Momentum');
  });

  it('returns multi-session message when sessionsToday > 1', () => {
    const msg = service.getSessionCompleteMessage({
      currentStreak: 1,
      isNewRecord: false,
      sessionsToday: 3,
    });
    expect(msg).toContain('3');
    expect(msg).toContain('sessions');
  });

  it('returns generic fallback message for streak 1, single session', () => {
    const msg = service.getSessionCompleteMessage({
      currentStreak: 1,
      isNewRecord: false,
      sessionsToday: 1,
    });
    expect(msg).toContain('Every session counts');
  });
});
