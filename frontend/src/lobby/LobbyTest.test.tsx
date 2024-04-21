import {it, vi, afterEach} from 'vitest';
import {cleanup, render, screen} from '@testing-library/react';
import Lobby from "./Lobby"

afterEach(cleanup);

it('renders a summary', () => {
    const setGameState = vi.fn();

    render(
        <Lobby lobbyId={""} setGameState={setGameState} myPlayerId={""} winner={"imposter"}/>
    );
    screen.getByText('Leave');
});
