import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, spacing } from '../theme';

// Same visual constants as MonthlyCalendarCard
const GRID_COLOR = '#1c2538';
const CELL_NULL  = '#07090f';
const CELL_EMPTY = '#0d1320';
const DOW_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const CELL_H     = 36;

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// Mon-based offset (0=Mon … 6=Sun) for the 1st of the month
function firstDayOffset(year: number, month: number): number {
  const d = new Date(year, month, 1).getDay(); // 0=Sun
  return d === 0 ? 6 : d - 1;
}

function toISO(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function todayISO(): string {
  const t = new Date();
  return toISO(t.getFullYear(), t.getMonth(), t.getDate());
}

// Normalize any ISO string (full datetime or date-only) to YYYY-MM-DD
function toDateOnly(v: string): string {
  return v.slice(0, 10);
}

interface Props {
  value: string | null;
  onChange: (date: string | null) => void;
  accentColor?: string;
}

export function DatePicker({ value, onChange, accentColor = colors.primary }: Props) {
  const today = new Date();
  // Normalize: backend may return full ISO datetime ("2026-05-14T00:00:00.000Z")
  const dateOnly = value ? toDateOnly(value) : null;
  const initDate = dateOnly ? new Date(`${dateOnly}T00:00:00`) : today;

  const [year,  setYear]  = useState(initDate.getFullYear());
  const [month, setMonth] = useState(initDate.getMonth());

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const monthLabel = new Date(year, month, 1)
    .toLocaleDateString('en', { month: 'long', year: 'numeric' });

  const offset  = firstDayOffset(year, month);
  const numDays = daysInMonth(year, month);
  const now     = todayISO();

  // Build rows of 7 — null for padding cells, number for real days
  const cells: (number | null)[] = [
    ...Array<null>(offset).fill(null),
    ...Array.from({ length: numDays }, (_, i) => i + 1),
  ];
  const totalCells = Math.ceil(cells.length / 7) * 7;
  while (cells.length < totalCells) cells.push(null);
  const rows: (number | null)[][] = Array.from(
    { length: totalCells / 7 },
    (_, r) => cells.slice(r * 7, r * 7 + 7)
  );

  return (
    <View style={{ overflow: 'hidden' }}>
      {/* Navigation header — same style as MonthlyCalendarCard */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.sm,
      }}>
        <Pressable onPress={prevMonth} hitSlop={12} style={{ padding: 4 }}>
          <Text style={{ color: colors.primary, fontSize: 22, fontWeight: '700', lineHeight: 26 }}>‹</Text>
        </Pressable>
        <Text style={{ color: colors.text, fontSize: 14, fontWeight: '900' }}>{monthLabel}</Text>
        <Pressable onPress={nextMonth} hitSlop={12} style={{ padding: 4 }}>
          <Text style={{ color: colors.primary, fontSize: 22, fontWeight: '700', lineHeight: 26 }}>›</Text>
        </Pressable>
      </View>

      {/* Day-of-week header — same style as MonthlyCalendarCard */}
      <View style={{
        flexDirection: 'row',
        backgroundColor: GRID_COLOR,
        paddingVertical: 6,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ffffff0e',
      }}>
        {DOW_LABELS.map((d) => (
          <View key={d} style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{
              color: colors.textMuted,
              fontSize: 10,
              fontWeight: '700',
              letterSpacing: 0.5,
            }}>
              {d.toUpperCase()}
            </Text>
          </View>
        ))}
      </View>

      {/* Grid — same gap-as-grid-lines pattern */}
      <View style={{ backgroundColor: GRID_COLOR, gap: 1, paddingBottom: 1 }}>
        {rows.map((row, ri) => (
          <View key={ri} style={{ flexDirection: 'row', backgroundColor: GRID_COLOR, gap: 1 }}>
            {row.map((day, di) => {
              if (day === null) {
                return (
                  <View
                    key={`n${di}`}
                    style={{ flex: 1, height: CELL_H, backgroundColor: CELL_NULL }}
                  />
                );
              }

              const iso        = toISO(year, month, day);
              const isToday    = iso === now;
              const isSelected = iso === dateOnly;
              const isPast     = iso < now;

              return (
                <Pressable
                  key={day}
                  onPress={() => onChange(isSelected ? null : iso)}
                  style={{
                    flex: 1,
                    height: CELL_H,
                    backgroundColor: isSelected ? accentColor : CELL_EMPTY,
                    borderTopWidth: isToday && !isSelected ? 2.5 : 0,
                    borderTopColor: colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{
                    fontSize: 13,
                    fontWeight: isToday || isSelected ? '900' : '400',
                    color: isSelected
                      ? '#fff'
                      : isToday
                      ? colors.primary
                      : isPast
                      ? '#3a4a60'
                      : colors.text,
                  }}>
                    {day}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}
