// src/components/tests/MedicalTestsList.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import MedicalTestsList from '../MedicalTestsList';
import { getPatients } from '../../datas/api';
import {beforeEach, test, expect, describe} from "@jest/globals";

jest.mock('../../datas/api', () => ({
    getPatients: jest.fn(),
}));

describe('MedicalTestsList Component', () => {
    const mockPatients = [
        { id: '1', name: 'Tiago Dias' },
        { id: '2', name: 'Manoela Dias' },
    ];

    beforeEach(() => {
        getPatients.mockResolvedValue(mockPatients);
    });

    test('renders Medical Tests title', () => {
        render(<MedicalTestsList />);
        expect(screen.getByText('Medical Tests')).toBeInTheDocument();
    });

    test('renders Show Patients button and toggles patient list', async () => {
        render(<MedicalTestsList />);

        const toggleButton = screen.getByText('Show Patients');
        expect(toggleButton).toBeInTheDocument();

        act(() => {
            fireEvent.click(toggleButton);
        });

        await waitFor(() => {
            expect(screen.getByText('Tiago Dias')).toBeInTheDocument();
            expect(screen.getByText('Manoela Dias')).toBeInTheDocument();
        });

        act(() => {
            fireEvent.click(toggleButton);
        });

        await waitFor(() => {
            expect(screen.queryByText('Tiago Dias')).not.toBeInTheDocument();
        });
    });

    test('handles patient click', async () => {
        render(<MedicalTestsList />);

        act(() => {
            fireEvent.click(screen.getByText('Show Patients'));
        });

        await waitFor(() => {
            const patientItem = screen.getByText('Tiago Dias');
            expect(patientItem).toBeInTheDocument();

            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

            act(() => {
                fireEvent.click(patientItem);
            });

            expect(consoleLogSpy).toHaveBeenCalledWith('Aqui seria uma rota para o Paciente/Appointment', { id: '1', name: 'Tiago Dias' });

            consoleLogSpy.mockRestore();
        });
    });
});
