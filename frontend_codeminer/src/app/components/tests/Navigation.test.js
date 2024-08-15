// codeminer/frontend_codeminer/src/app/components/tests/Navigation.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from '../Navigation';
import { useRouter } from 'next/navigation';
import {afterEach, beforeEach, describe, test, expect} from "@jest/globals";

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('Navigation Component', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        useRouter.mockReturnValue({ push: mockPush });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders Home and Dashboard buttons', () => {
        render(<Navigation />);

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    test('navigates to Home when Home button is clicked', () => {
        render(<Navigation />);

        fireEvent.click(screen.getByText('Home'));
        expect(mockPush).toHaveBeenCalledWith('/');
    });

    test('navigates to Dashboard when Dashboard button is clicked', () => {
        render(<Navigation />);

        fireEvent.click(screen.getByText('Dashboard'));
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
});
