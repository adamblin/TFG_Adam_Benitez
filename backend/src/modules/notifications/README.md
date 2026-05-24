# Notifications

Genera missatges motivacionals contextuals després de finalitzar una sessió de concentració.

## Lògica de missatge (`getSessionCompleteMessage`)

Els missatges es prioritzen en aquest ordre:

1. **Nou rècord** (`isNewRecord && streak > 1`) → missatge de rècord amb dies de ratxa.
2. **Ratxa ≥ 30 dies** → missatge de consistència absoluta.
3. **Ratxa ≥ 7 dies** → missatge de formació d'hàbit.
4. **Ratxa ≥ 3 dies** → missatge de moment.
5. **Múltiples sessions avui** (`sessionsToday > 1`) → missatge de bloc de focus.
6. **Cas base** → missatge genèric de sessió completada.

## Ús

Aquest servei és cridat exclusivament per `EndSessionUseCase` en finalitzar una sessió completada.
