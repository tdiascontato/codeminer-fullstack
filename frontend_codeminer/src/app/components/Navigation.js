// codeminer/frontend_codeminer/src/components/Navigation.js
"use client";
import { useRouter } from 'next/navigation';
import styles from '@/app/stylus/navigation.module.css';

export default function Navigation() {
    const router = useRouter();

    const goToDashboard = () => {
        router.push('/dashboard');
    };

    const goToHome = () => {
        router.push('/');
    };

    return (
        <nav className={styles.nav}>
            <button onClick={goToHome} className={styles.navButton}>Home</button>
            <button onClick={goToDashboard} className={styles.navButton}>Dashboard</button>
        </nav>
    );
}
