// src/app/components/tests/PatientsList.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PatientsList from '../PatientsList';
import { beforeEach, test, expect, describe } from '@jest/globals';

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children }) => children,
}));

describe('PatientsList Component', () => {
    const mockPatients = Array.from({ length: 25 }, (_, index) => ({
        id: (index + 1).toString(),
        name: `Patient ${index + 1}`,
    }));

    beforeEach(() => {
        render(<PatientsList patients={mockPatients} />);
    });

    test('renders the patient names correctly', () => {
        mockPatients.slice(0, 10).forEach(patient => {
            expect(screen.getByText(patient.name)).toBeInTheDocument();
        });
    });

    test('renders Previous and Next buttons', () => {
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
    });

    test('navigates through pages correctly', () => {

        const nextButton = screen.getByText('Next');
        const previousButton = screen.getByText('Previous');

        fireEvent.click(nextButton);
        mockPatients.slice(10, 20).forEach(patient => {
            expect(screen.getByText(patient.name)).toBeInTheDocument();
        });

        fireEvent.click(previousButton);
        mockPatients.slice(0, 10).forEach(patient => {
            expect(screen.getByText(patient.name)).toBeInTheDocument();
        });
    });
});
