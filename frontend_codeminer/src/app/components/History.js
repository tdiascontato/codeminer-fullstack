// codeminer/frontend_codeminer/src/app/components/History.js
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/stylus/history.module.css';
import { getAppointments, getPatientsId } from '../datas/api';

export default function History() {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const router = useRouter();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const appointmentsData = await getAppointments();
                const pastAppointments = appointmentsData.filter(appointment => new Date(appointment.startTime) < new Date());
                setAppointments(pastAppointments);

                const uniquePatientIds = [...new Set(pastAppointments.map(app => app.patientId))];
                const patientsData = {};
                for (const id of uniquePatientIds) {
                    const patient = await getPatientsId(id);
                    patientsData[id] = patient.name;
                }
                setPatients(patientsData);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, []);

    const handleAppointmentClick = (appointment) => {
        console.log('Aqui seria uma rota para o Paciente/Appointment', appointment);
        // router.push(`/details/${appointment.id}`);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentAppointments = Array.isArray(appointments)
        ? appointments.slice(startIndex, startIndex + itemsPerPage)
        : [];
    const totalPages = Array.isArray(appointments)
        ? Math.ceil(appointments.length / itemsPerPage)
        : 0;

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending':
                return styles.status_pending;
            case 'completed':
                return styles.status_completed;
            case 'cancelled':
                return styles.status_cancelled;
            case 'absent':
                return styles.status_absent;
            default:
                return '';
        }
    };

    return (
        <div className={styles.history}>
            <h2>Histórico de Consultas</h2>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Paciente</th>
                    <th>Tipo</th>
                </tr>
                </thead>
                <tbody>
                {currentAppointments.length > 0 ? (
                    currentAppointments.map(appointment => (
                        <tr
                            key={appointment.id}
                            onClick={() => handleAppointmentClick(appointment)}
                        >
                            <td>{new Date(appointment.startTime).toLocaleDateString()}</td>
                            <td className={getStatusClass(appointment.status)}>
                                {appointment.status}
                            </td>
                            <td>{patients[appointment.patientId] || 'Loading...'}</td>
                            <td>{appointment.type}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4">Nenhum compromisso encontrado.</td>
                    </tr>
                )}
                </tbody>
            </table>
            <div className={styles.pagination}>
                {totalPages > 1 && Array.from({ length: totalPages }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={currentPage === index + 1 ? styles.active : ''}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
