// src/app/components/PatientsList.js
import { useState } from 'react';
import Link from 'next/link';

export default function PatientsList({ patients }) {
    const [page, setPage] = useState(1);

    const handleNextPage = () => {
        setPage(prevPage => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setPage(prevPage => Math.max(prevPage - 1, 1));
    };

    return (
        <div>
            <ul>
                {patients.slice((page - 1) * 10, page * 10).map(patient => (
                    <li key={patient.id}>
                        <Link href={`/patient/${patient.id}`}>
                            <a>{patient.name}</a>
                        </Link>
                    </li>
                ))}
            </ul>
            <button onClick={handlePreviousPage} disabled={page === 1}>
                Previous
            </button>
            <button onClick={handleNextPage} disabled={page * 10 >= patients.length}>
                Next
            </button>
        </div>
    );
}
