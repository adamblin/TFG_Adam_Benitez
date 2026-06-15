# Feature: Tasks

Pantalla de gestió de tasques i subtasques amb suport de descomposició automàtica per IA.

## Hooks principals

| Hook | Descripció |
|---|---|
| `useTasks` | Query: llista de tasques de l'usuari |
| `useCreateTask` | Mutation: crea una tasca |
| `useUpdateTask` | Mutation: actualitza tasca; mostra celebració en completar |
| `useDeleteTask` | Mutation: elimina tasca amb optimistic update |
| `useCreateSubtask` | Mutation: crea subtasca |
| `useToggleSubtask` | Mutation: completa/descompleta subtasca amb celebració |
| `useUpdateSubtask` | Mutation: actualitza títol de subtasca |
| `useDeleteSubtask` | Mutation: elimina subtasca amb optimistic update |

## Descomposició amb IA

El botó "Break it down" crida `POST /tasks/breakdown` amb la descripció de la tasca i rep un nom suggerit + llista de subtasques generades per OpenAI.

## Notes

- Els hooks de mutation usen **optimistic updates**: la UI s'actualitza abans de rebre resposta del servidor, revertint en cas d'error.
- En completar una tasca o subtasca es mostra la celebració de ratxa si és la primera acció del dia, o una frase motivacional en cas contrari.
