// codeminer/frontend_codeminer/src/components/MedicalTestsList.js
"use client";
import React, { useState, useEffect } from 'react';
import { getPatients } from '../datas/api';
import styles from '@/app/stylus/medicalTests.module.css';

export default function MedicalTestsList() {
    const [patients, setPatients] = useState([]);
    const [showPatients, setShowPatients] = useState(false);

    const fetchPatients = async () => {
        try {
            const patientsData = await getPatients();
            setPatients(patientsData);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const handleAppointmentClick = (patient) => {
        console.log('Aqui seria uma rota para o Paciente/Appointment', patient);
        // router.push(`/details/${appointment.id}`);
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    return (
        <div className={styles.medical_tests}>
            <h2 className={styles.medical_tests_title}>Medical Tests</h2>
            <button
                className={styles.toggleButton}
                onClick={() => setShowPatients(!showPatients)}
            >
                Show Patients
            </button>
            {showPatients && (
                <ul className={styles.patientList}>
                    {patients.map(patient => (
                        <li key={patient.id} className={styles.patientItem} onClick={() => handleAppointmentClick(patient)}>
                            {patient.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
