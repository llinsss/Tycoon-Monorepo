import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import JoinRoomForm from '../src/components/settings/JoinRoomForm';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }));

beforeEach(() => { mockPush.mockClear(); });

describe('JoinRoomForm — labeled fields', () => {
  it('renders a visible Room Code label linked to the input', () => {
    render(<JoinRoomForm />);
    const label = screen.getByText('Room Code');
    expect(label).toBeDefined();
    const input = screen.getByLabelText('Room Code');
    expect(input).toBeDefined();
  });

  it('renders the Join submit button', () => {
    render(<JoinRoomForm />);
    expect(screen.getByRole('button', { name: /join/i })).toBeDefined();
  });
});

describe('JoinRoomForm — invalid input', () => {
  it('shows an error when submitting a short code', () => {
    render(<JoinRoomForm />);
    fireEvent.change(screen.getByLabelText('Room Code'), { target: { value: 'AB' } });
    fireEvent.submit(screen.getByRole('button', { name: /join/i }).closest('form')!);
    expect(screen.getByText(/6 characters/i)).toBeDefined();
  });

  it('submit button is disabled when input is empty', () => {
    render(<JoinRoomForm />);
    const btn = screen.getByRole('button', { name: /join/i }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });
});

describe('JoinRoomForm — service unavailable message', () => {
  it('clears the error when the user starts typing again', () => {
    render(<JoinRoomForm />);
    const input = screen.getByLabelText('Room Code') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'AB' } });
    fireEvent.submit(input.closest('form')!);
    expect(screen.getByText(/6 characters/i)).toBeDefined();
    fireEvent.change(input, { target: { value: 'ABC' } });
    expect(screen.queryByText(/6 characters/i)).toBeNull();
  });
});

describe('JoinRoomForm — success navigation', () => {
  it('navigates to game-waiting with the room code on valid submit', () => {
    render(<JoinRoomForm />);
    fireEvent.change(screen.getByLabelText('Room Code'), { target: { value: 'ABC123' } });
    fireEvent.submit(screen.getByRole('button', { name: /join/i }).closest('form')!);
    expect(mockPush).toHaveBeenCalledWith('/game-waiting?gameCode=ABC123');
  });

  it('uppercases the code before navigating', () => {
    render(<JoinRoomForm />);
    fireEvent.change(screen.getByLabelText('Room Code'), { target: { value: 'abc123' } });
    fireEvent.submit(screen.getByRole('button', { name: /join/i }).closest('form')!);
    expect(mockPush).toHaveBeenCalledWith('/game-waiting?gameCode=ABC123');
  });
});
