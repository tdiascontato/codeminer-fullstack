// codeminer/frontend_codeminer/src/app/tests/page.test.js
"use client";
import Calendar from '@/app/components/Calendar';
import History from '@/app/components/History';
import styles from "@/app/stylus/page.module.css";
import Navigation from "@/app/components/Navigation";
import MedicalTestsList from "@/app/components/MedicalTestsList";

export default function Home() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <section className={styles.patientsListSection}>
                    <MedicalTestsList />
                    <Navigation />
                </section>
                <section className={styles.calendarHistory}>
                    <Calendar />
                    <History />
                </section>
            </div>
        </main>
    );
}

