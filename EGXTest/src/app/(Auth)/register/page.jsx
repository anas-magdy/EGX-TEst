'use client';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Briefcase } from 'lucide-react';

export default function SelectRolePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl w-full">
        {/* Admin Card */}
        <div
          onClick={() => {
            router.push(`/register/registerForm?role=Admin`);
          }}
          className="cursor-pointer bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center text-center group"
        >
          <ShieldCheck className="w-12 h-12 text-blue-600 group-hover:scale-110 transition" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Admin</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage seminars, users, and system settings.
          </p>
        </div>

        {/* Broker Card */}
        <div
          onClick={() => {
            router.push(`/register/registerForm?role=User`);
          }}
          className="cursor-pointer bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center text-center group"
        >
          <Briefcase className="w-12 h-12 text-green-600 group-hover:scale-110 transition" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Broker</h2>
          <p className="text-gray-500 text-sm mt-1">
            Organize and attend seminars with full access.
          </p>
        </div>
      </div>
    </main>
  );
}
