// src/app/components/tests/History.test.js
import { render, screen } from '@testing-library/react';
import History from '../History'; // Ajuste o caminho conforme necessário
import { useRouter } from 'next/navigation';
import {beforeEach, describe, it, expect} from "@jest/globals";

jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}));

describe('History Component', () => {
    beforeEach(() => {
        useRouter.mockReturnValue({
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
            back: jest.fn(),
            beforePopState: jest.fn(),
            events: {
                on: jest.fn(),
                off: jest.fn()
            },
            isFallback: false,
            isReady: true,
            route: '/',
            asPath: '/',
            query: {}
        });
    });

    it('renders "Histórico de Consultas" title', () => {
        render(<History />);
        expect(screen.getByText('Histórico de Consultas')).toBeInTheDocument();
    });
});
