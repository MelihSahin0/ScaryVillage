export type gameState = 'startingScreen' | 'lobby' | 'inGame' | 'voting';

export type role = 'crewmate' | 'imposter' | 'crewmateGhost' | 'imposterGhost' | 'deadBody';

export const colors = [
    'red', 'blue', 'green', 'orange', 'purple', 'cyan', 'pink',
    'lime', 'yellow', 'zinc'
];

export type games = "Bin" | "Chicken" | "Chopping" | "Cooking" | "Fishing" |
                    "Flooding" | "Fountain" | "Mining" | "Sleeping"