'use client';
import { useState } from 'react';

// Simulated broker data
const brokers = [
    {
        BROKER_CODE: '1017',
        BROKER_LONG_NAME: 'ثري ايه لتداول الاوراق المالية',
        BROKER_SHORT_NAME: 'ثري ايه',
        BROKER_NAME_ENG: 'Triple A Securities Co.',
        BROKER_TELL: '5749547/7616502/5783959',
        BROKER_FAX: '5797442',
        SUSPENSION_CODE: 'A',
    },
    {
        BROKER_CODE: '1025',
        BROKER_LONG_NAME: 'المشرق للتدول الأوراق المالية',
        BROKER_SHORT_NAME: 'المشرق',
        BROKER_NAME_ENG: 'Mashreq trade',
        BROKER_TELL: '3935950-3935990-3920002',
        BROKER_FAX: '3935823',
        SUSPENSION_CODE: 'D',
    },
    {
        BROKER_CODE: '1056',
        BROKER_LONG_NAME: 'جولدن واي لتداول الأوراق المالية',
        BROKER_SHORT_NAME: 'جولدن',
        BROKER_NAME_ENG: 'Golden Way Securities',
        BROKER_TELL: '3384171/3384172/3384173/3384174',
        BROKER_FAX: '3365633',
        SUSPENSION_CODE: 'A',
    },
    {
        BROKER_CODE: '1061',
        BROKER_LONG_NAME: 'المعادى لتداول الأوراق المالية',
        BROKER_SHORT_NAME: 'المعادى',
        BROKER_NAME_ENG: 'Maadi for Stock Dealing',
        BROKER_TELL: '7600261 - 7619351',
        BROKER_FAX: '7600261',
        SUSPENSION_CODE: 'A',
    },
];

export default function BrokersPage() {
    const [search, setSearch] = useState('');

    const filteredBrokers = brokers.filter((broker) =>
        broker.BROKER_CODE.includes(search) ||
        broker.BROKER_SHORT_NAME.includes(search) ||
        broker.BROKER_LONG_NAME.includes(search) ||
        broker.BROKER_NAME_ENG.toLowerCase().includes(search.toLocaleLowerCase()) ||
        broker.SUSPENSION_CODE.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-[85%] mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
                    Brokers Directory
                </h1>

                <input
                    type="text"
                    placeholder="Search by Code, Short Name, Full Name, or Suspension Code..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full mb-6 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />

                <div className="overflow-x-auto bg-white shadow-md rounded-xl">
                    <table className="min-w-full text-sm text-left text-gray-800">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="p-4">Code</th>
                                <th className="p-4">Short Name</th>
                                <th className="p-4">Full Name</th>
                                <th className="p-4">English Name</th>
                                <th className="p-4">Phone</th>
                                <th className="p-4">Fax</th>
                                <th className="p-4">Suspension</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBrokers.length > 0 ? (
                                filteredBrokers.map((broker, index) => (
                                    <tr
                                        key={index}
                                        className="border-b hover:bg-gray-50 transition duration-150"
                                    >
                                        <td className="p-4">{broker.BROKER_CODE}</td>
                                        <td className="p-4">{broker.BROKER_SHORT_NAME}</td>
                                        <td className="p-4">{broker.BROKER_LONG_NAME}</td>
                                        <td className="p-4">{broker.BROKER_NAME_ENG}</td>
                                        <td className="p-4">{broker.BROKER_TELL}</td>
                                        <td className="p-4">{broker.BROKER_FAX}</td>
                                        <td className="p-4">{broker.SUSPENSION_CODE}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center p-6 text-gray-500">
                                        No brokers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
