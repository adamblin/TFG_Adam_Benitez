# Motivational Phrases

Proporciona frases motivacionals aleatòries categoritzades, mostrades a l'usuari en completar accions.

## Endpoint

`GET /motivational-phrases/random?category=SUBTASK` → retorna una frase aleatòria de la categoria indicada.

## Categories disponibles

Definides a `domain/entities/phrase.entity.ts`. Les frases estan precarregades a la base de dades mitjançant seeds.

## Ús al frontend

El frontend crida aquest endpoint directament des de `useToggleSubtask` i `useFocusSession` per mostrar una frase motivacional en un modal en completar subtasques o sessions de focus.
