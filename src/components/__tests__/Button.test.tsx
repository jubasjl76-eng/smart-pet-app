import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('<Button>', () => {
  it('renders the title and fires onPress', () => {
    const onPress = jest.fn();
    render(<Button title="Feed now" onPress={onPress} />);

    const btn = screen.getByText('Feed now');
    fireEvent.press(btn);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire onPress while disabled', () => {
    const onPress = jest.fn();
    render(<Button title="Feed now" onPress={onPress} disabled />);
    fireEvent.press(screen.getByText('Feed now'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows a spinner and no label while loading', () => {
    render(<Button title="Feed now" onPress={jest.fn()} loading />);
    expect(screen.queryByText('Feed now')).toBeNull();
  });
});
