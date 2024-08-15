// codeminer/frontend_codeminer/src/app/components/tests/Calendar.test.js
import { describe, expect, it, beforeEach, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import Calendar from "@/app/components/Calendar";
import * as api from "@/app/datas/api";
import { act } from 'react';

const mockPatients = [
    { id: 1, name: 'Tiago Dias' },
    { id: 2, name: 'Manoela Dias' },
];

const mockAppointments = [
    {
        startTime: new Date().toISOString(),
        endTime: new Date(new Date().getTime() + 30 * 60000).toISOString(),
        patientId: 1,
        description: 'Check-up',
    },
    {
        startTime: new Date(new Date().setHours(13)).toISOString(),
        endTime: new Date(new Date().setHours(14)).toISOString(),
        patientId: 2,
        description: 'Consultation',
    },
];

jest.mock('@/app/datas/api', () => ({
    getAppointments: jest.fn(),
    getPatients: jest.fn(),
}));

describe('Calendar', () => {
    beforeEach(() => {
        api.getAppointments.mockResolvedValue(mockAppointments);
        api.getPatients.mockResolvedValue(mockPatients);
    });

    it('renders correctly', async () => {
        await act(async () => {
            render(<Calendar />);
        });
        expect(screen.getByText('09:00')).toBeInTheDocument();
        expect(screen.getByText('10:00')).toBeInTheDocument();
        expect(screen.getByText('11:00')).toBeInTheDocument();
        expect(screen.getByText('12:00')).toBeInTheDocument();
    });

});
