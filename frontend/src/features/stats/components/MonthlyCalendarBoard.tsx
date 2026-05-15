import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { styles } from './MonthlyCalendarBoard.styles';

interface MonthlyEvent {
  id: string;
  label: string;
  color: string;
}

interface MonthlyDay {
  id: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday?: boolean;
  events: MonthlyEvent[];
}

interface MonthlyCalendarBoardProps {
  monthTitle: string;
  dayLabels: string[];
  weeks: MonthlyDay[][];
}

export function MonthlyCalendarBoard({ monthTitle, dayLabels, weeks }: MonthlyCalendarBoardProps) {
  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.board}>
          <View style={styles.monthHeader}>
            <Text style={styles.monthTitle}>{monthTitle}</Text>
          </View>

          <View style={styles.daysRow}>
            {dayLabels.map((label) => (
              <View key={label} style={styles.dayHeader}>
                <Text style={styles.dayHeaderText}>{label}</Text>
              </View>
            ))}
          </View>

          {weeks.map((week) => (
            <View key={week[0]?.id} style={styles.weekRow}>
              {week.map((day) => (
                <View key={day.id} style={[styles.dayCell, !day.isCurrentMonth && styles.mutedDay]}>
                  <Text style={[styles.dayNumber, day.isToday && styles.todayBadge]}>{day.dayNumber}</Text>
                  {day.events.slice(0, 3).map((event) => (
                    <View key={event.id} style={styles.eventRow}>
                      <View style={[styles.eventDot, { backgroundColor: event.color }]} />
                      <Text style={styles.eventLabel}>{event.label}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
