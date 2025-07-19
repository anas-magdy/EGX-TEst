'use client';
import { useEffect, useState } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function BrokersPage() {
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [brokers, setBrokers] = useState([]);
    const [newBroker, setNewBroker] = useState(getEmptyBroker());

    const [page, setPage] = useState(1);
    const pageSize = 20;
    const [totalPages, setTotalPages] = useState(1);

    const isEditing = brokers.some((b) => b.brokerCode === newBroker.brokerCode);

    useEffect(() => {
        if (search.trim()) {
            searchByCode(search.trim());
        } else {
            fetchBrokers(page);
        }
    }, [search, page]);

    const fetchBrokers = async (page = 1) => {
        try {
            const res = await fetch(`http://localhost:5237/all?page=${page}&pageSize=${pageSize}`);
            const result = await res.json();

            if (result?.data) {
                setBrokers(result.data);
                setTotalPages(result.totalPages);
            } else {
                setBrokers([]);
            }
        } catch (err) {
            console.error('❌ Failed to fetch brokers:', err);
        }
    };

    const searchByCode = async (code) => {
        try {
            const res = await fetch(`http://localhost:5237/Broker/${code}`);
            if (!res.ok) throw new Error('Broker not found');

            const result = await res.json();
            setBrokers([result]);
            setTotalPages(1);
            setPage(1);
        } catch (err) {
            console.error('❌ Failed to search by code:', err);
            setBrokers([]);
            setTotalPages(1);
            setPage(1);
        }
    };

    function getEmptyBroker() {
        return {
            brokerCode: '',
            brokerShortName: '',
            brokerLongName: '',
            brokerNameEng: '',
            brokerAddress: '',
            brokerTelephone: '',
            brokerFax: '',
            suspensionCode: '',
        };
    }

    const handleChange = (e) => {
        setNewBroker({ ...newBroker, [e.target.name]: e.target.value });
    };

    const getTokenFromCookie = () => {
        const match = document.cookie.match(/(?:^|; )Authorization=([^;]*)/);
        return match ? decodeURIComponent(match[1]) : null;
    };

    const handleAddOrUpdateBroker = async () => {
        try {
            const url = isEditing
                ? `http://localhost:5237/update/${newBroker.brokerCode}`
                : 'http://localhost:5237/add';

            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: getTokenFromCookie(),
                },
                body: JSON.stringify(newBroker),
            });

            if (!res.ok) throw new Error('Failed to save broker');

            fetchBrokers(page);
            setShowModal(false);
            setNewBroker(getEmptyBroker());
        } catch (err) {
            console.error('❌ Failed to save broker:', err);
        }
    };

    const handleDeleteBroker = async (code) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action will delete the broker!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`http://localhost:5237/Broker/delete/${code}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: getTokenFromCookie(),
                    },
                });

                if (!res.ok) throw new Error('Failed to delete broker');

                if (!search.trim()) {
                    fetchBrokers(page);
                } else {
                    setSearch('');
                }

                Swal.fire('Deleted!', 'The broker has been deleted.', 'success');
            } catch (err) {
                console.error('❌ Failed to delete broker:', err);
                Swal.fire('Error!', 'Something went wrong.', 'error');
            }
        }
    };

    const handleEditBroker = (broker) => {
        setNewBroker(broker);
        setShowModal(true);
    };

    const handleViewBroker = (broker) => {
        alert(`
🔍 Broker Details:
    - Code: ${broker.brokerCode}
    - Name: ${broker.brokerLongName}
    - Phone: ${broker.brokerTelephone}
    - Fax: ${broker.brokerFax}
    - Suspension: ${broker.suspensionCode}
        `);
    };

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-[85%] mx-auto">
                <h1 className="text-3xl font-bold mb-4 text-center text-blue-800">Brokers Directory</h1>

                <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
                    <input
                        type="text"
                        placeholder="Search by Code only..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                    <button
                        onClick={() => {
                            setNewBroker(getEmptyBroker());
                            setShowModal(true);
                        }}
                        className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition font-semibold"
                    >
                        Add Broker
                    </button>
                </div>

                <div className="overflow-x-auto bg-white shadow-md rounded-xl">
                    <table className="min-w-full text-sm text-left text-gray-800">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="p-4">Code</th>
                                <th className="p-4">Short Name</th>
                                <th className="p-4">Full Name</th>
                                <th className="p-4">English Name</th>
                                <th className="p-4">Phone</th>
                                <th className="p-4">Address</th>
                                <th className="p-4">Fax</th>
                                <th className="p-4">Suspension</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brokers.length > 0 ? (
                                brokers.map((broker, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50 transition duration-150">
                                        <td className="p-4">{broker.brokerCode}</td>
                                        <td className="p-4">{broker.brokerShortName}</td>
                                        <td className="p-4">{broker.brokerLongName}</td>
                                        <td className="p-4">{broker.brokerNameEng}</td>
                                        <td className="p-4">{broker.brokerTelephone}</td>
                                        <td className="p-4">{broker.brokerAddress}</td>
                                        <td className="p-4">{broker.brokerFax}</td>
                                        <td className="p-4">{broker.suspensionCode}</td>
                                        <td className="p-4 text-center space-x-2">
                                            <button onClick={() => handleViewBroker(broker)} title="View Details" className="text-blue-600 hover:text-blue-800">
                                                <Eye size={18} className="inline-block" />
                                            </button>
                                            <button onClick={() => handleEditBroker(broker)} title="Edit" className="text-yellow-500 hover:text-yellow-600">
                                                <Edit size={18} className="inline-block" />
                                            </button>
                                            <button onClick={() => handleDeleteBroker(broker.brokerCode)} title="Delete" className="text-red-600 hover:text-red-700">
                                                <Trash2 size={18} className="inline-block" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center p-6 text-gray-500">No brokers found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ✅ Pagination controls */}
                {!search && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                        <button
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 rounded-xl bg-gray-300 text-gray-800 hover:bg-gray-400 disabled:opacity-50"
                        >
                            Previous
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`px-3 py-1 rounded-xl ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-blue-700`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 rounded-xl bg-gray-300 text-gray-800 hover:bg-gray-400 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {showModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                    >
                        <h2 className="text-xl font-bold text-center text-blue-800 mb-4">
                            {isEditing ? 'Edit Broker' : 'Add New Broker'}
                        </h2>

                        {Object.entries(newBroker).map(([key, value]) => (
                            <div key={key} className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                                    {key.replace(/([a-z])([A-Z])/g, '$1 $2')}
                                </label>
                                <input
                                    name={key}
                                    value={value}
                                    onChange={handleChange}
                                    placeholder={key.replace(/([a-z])([A-Z])/g, '$1 $2')}
                                    className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400"
                                />
                            </div>
                        ))}

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddOrUpdateBroker}
                                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
