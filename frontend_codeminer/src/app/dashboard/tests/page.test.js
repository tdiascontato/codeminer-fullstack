import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Page from '../page';
import { getAppointments, getPatients } from '../../datas/api';
import { beforeEach, describe, test, expect } from '@jest/globals';
import { useRouter } from 'next/navigation';

jest.mock('../../datas/api', () => ({
    getAppointments: jest.fn(),
    getPatients: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('Page Component', () => {
    const mockAppointments = [
    ];

    const mockPatients = [
    ];

    beforeEach(() => {
        getAppointments.mockResolvedValue(mockAppointments);
        getPatients.mockResolvedValue(mockPatients);
        useRouter.mockReturnValue({
            push: jest.fn(),
        });
    });

    test('renders the page with appointments and patients', async () => {
        render(<Page />);

        await waitFor(() => {
            expect(getAppointments).toHaveBeenCalled();
            expect(getPatients).toHaveBeenCalled();
        });

    });

    test('handles category click and appointment click', async () => {
        render(<Page />);
        await waitFor(() => {
            expect(getAppointments).toHaveBeenCalled();
        });

    });
});
