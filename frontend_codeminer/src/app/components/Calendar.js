// codeminer/frontend_codeminer/src/app/components/Calendar.js
"use client";
import React, { useEffect, useState } from 'react';
import styles from '@/app/stylus/calendar.module.css';
import { getStartOfWeek, getDayOfWeek, getFormattedTime } from '../utils/dateUtils';
import { getAppointments, getPatients } from '../datas/api';

export default function Calendar() {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);

    const hours = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
        '18:00'
    ];

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

    const getStartOfWeekAdjusted = (date) => {
        let startOfWeek = getStartOfWeek(date);
        const day = date.getDay();
        if (day === 6 || day === 0) {
            startOfWeek.setDate(startOfWeek.getDate() + 7);
        }
        return startOfWeek;
    };

    const startOfWeek = getStartOfWeekAdjusted(new Date());

    const fetchPatientsAppointments = async () => {
        try {
            const fetchedPatients = await getPatients();
            const fetchedAppointments = await getAppointments();
            setPatients(fetchedPatients);
            setAppointments(fetchedAppointments);
            // console.log("appointments: ", fetchedAppointments);
            // console.log("patients: ", fetchedPatients);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchPatientsAppointments();
    }, []);

    const getPatientNameById = (id) => {
        const patient = patients.find(p => p.id === id);
        return patient ? patient.name : 'Unknown Patient';
    };

    const generateColor = (id) => {
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#F0E68C', '#FF69B4', '#8A2BE2', '#FF4500'];
        return colors[id % colors.length];
    };

    const getEventsForTimeSlot = (day, hour) => {
        return appointments.filter(appointment => {
            const appointmentStartDate = new Date(appointment.startTime);
            const appointmentEndDate = appointment.endTime ? new Date(appointment.endTime) : new Date(appointment.startTime);
            const appointmentDay = getDayOfWeek(appointmentStartDate);
            const appointmentStartHour = getFormattedTime(appointmentStartDate);
            const appointmentEndHour = getFormattedTime(appointmentEndDate);
            return (
                appointmentDay === day &&
                ((hour >= appointmentStartHour && hour < appointmentEndHour) ||
                    (appointmentEndHour >= hour && hour >= appointmentStartHour))
            );
        });
    };

    const renderEvents = (day, hour) => {
        const events = getEventsForTimeSlot(day, hour);

        if (events.length === 0) return null;

        return events.map((event, index) => {
            const eventStart = new Date(event.startTime);
            const eventEnd = event.endTime ? new Date(event.endTime) : new Date(event.startTime);
            const eventDuration = (eventEnd - eventStart) / (1000 * 60 * 30);

            const height = eventDuration > 1 ? `${eventDuration * 3}rem` : '3rem';

            return (
                <div
                    key={index}
                    className={styles.event}
                    style={{
                        backgroundColor: generateColor(event.patientId),
                        height: height,
                        marginTop: height === '3rem' ? '0.5rem' : '0',
                    }}
                >
                    <span className={styles.event_name}>{getPatientNameById(event.patientId)}</span>
                    <span className={styles.event_description}>{event.description}</span>
                </div>
            );
        });
    };

    return (
        <div className={styles.calendar}>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th className={styles.emptyHeader}></th>
                    {daysOfWeek.map((day, index) => {
                        const date = new Date(startOfWeek);
                        date.setDate(startOfWeek.getDate() + index);
                        return (
                            <th key={day} className={styles.header}>
                                {day} {date.getDate()}
                            </th>
                        );
                    })}
                </tr>
                </thead>
                <tbody>
                {hours.map((hour, rowIndex) => (
                    <tr key={hour}>
                        <td className={styles.hour}>{hour}</td>
                        {daysOfWeek.map((day, colIndex) => (
                            <td key={colIndex} className={styles.cell}>
                                {renderEvents(day, hour)}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
