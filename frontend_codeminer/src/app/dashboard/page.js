"use client";
import { useState, useEffect } from 'react';
import styles from "@/app/stylus/dashboard.module.css";
import MedicalTestsList from '@/app/components/MedicalTestsList';
import Navigation from "@/app/components/Navigation";
import { getAppointments, getPatients } from '../datas/api.js';

export default function Page() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [appointmentDetails, setAppointmentDetails] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await getAppointments();
                setAppointments(data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        const fetchPatients = async () => {
            try {
                const data = await getPatients();
                setPatients(data.slice(0, 3));
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };
        fetchAppointments();
        fetchPatients();
    }, []);

    const handleCategoryClick = (category) => {
        setSelectedCategory(selectedCategory === category ? null : category);

        if (appointments) {
            const now = new Date();
            const filteredAppointments = appointments.filter(appointment => {
                const appointmentDate = new Date(appointment.startTime);
                if (category === 'recent') {
                    return appointmentDate >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
                } else if (category === 'upcoming') {
                    return appointmentDate > now;
                } else if (category === 'history') {
                    return appointmentDate < now;
                }
                return false;
            });
            setAppointmentDetails(filteredAppointments);
        } else {
            setAppointmentDetails([]);
        }
    };

    const handleAppointmentClick = (appointmentId) => {
        setSelectedAppointment(appointmentId);
    };

    const specialtyIcons = {
        general: '🩺',
        cardiology: '🫀',
        neurology: '🧠'
    };

    const renderAppointments = (category) => {
        return (
            <ul className={styles.appointmentsList}>
                {appointmentDetails.map((appointment) => (
                    <li
                        key={appointment.id}
                        className={styles.appointmentItem}
                        style={{ backgroundColor: appointment.color }}
                        onClick={() => handleAppointmentClick(appointment.id)}
                    >
                        <span>{specialtyIcons[appointment.specialty] || '🔍'}</span>
                        <span>{new Date(appointment.startTime).toLocaleDateString()}</span>
                        <span>{appointment.type}</span>
                        <span>{appointment.status}</span>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <section className={styles.medicalTestsListSection}>
                    <MedicalTestsList />
                    <Navigation />
                </section>
                <section className={styles.sectionRight}>
                    <section className={styles.detailsSection}>
                        {patients.map((patient, index) => (
                            <div key={index} className={styles.patientInfo}>
                                <h3>Patient info</h3>
                                <h2>{patient.name}</h2>
                                <p>{patient.healthSystemId}</p>
                            </div>
                        ))}
                    </section>

                    <div className={styles.appointments}>
                        <div className={styles.appointmentsHeader}>
                            <h3 onClick={() => handleCategoryClick('recent')}>Recent</h3>
                            <h3 onClick={() => handleCategoryClick('upcoming')}>Upcoming</h3>
                            <h3 onClick={() => handleCategoryClick('history')}>History</h3>
                        </div>
                        {selectedCategory && renderAppointments(selectedCategory)}
                    </div>

                    <div className={styles.appointmentDetails}>
                        <h3 className={styles.appointmentDetails_title}>Appointment Details</h3>
                        {appointmentDetails.filter(detail => detail.id === selectedAppointment).map((detail) => (
                            <div
                                key={detail.id}
                                className={styles.appointmentDetails_card}
                                style={{ backgroundColor: detail.color }}
                            >
                                <h2 className={styles.appointmentDetails_card_h2}>{specialtyIcons[detail.specialty] || '🔍'} {detail.title}</h2>
                                <p className={styles.appointmentDetails_card_p}>{detail.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
