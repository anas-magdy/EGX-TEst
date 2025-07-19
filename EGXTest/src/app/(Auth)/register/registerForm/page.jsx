'use client';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router=useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'User';

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [apiMessage, setApiMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required.';
        if (value.trim().length < 3) return 'Name must be at least 3 characters.';
        if (value.trim().length > 50) return 'Name must be less than 50 characters.';
        break;
      case 'email':
        if (!value.trim()) return 'Email is required.';
        if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email format.';
        break;
      case 'phone':
        if (!value.trim()) return 'Phone number is required.';
        if (!/^01[0-9]{9}$/.test(value)) return 'Phone number must start with 01 and be 11 digits.';
        break;
      case 'password':
        if (!value.trim()) return 'Password is required.';
        if (value.length < 6) return 'Password must be at least 6 characters.';
        break;
      case 'confirmPassword':
        if (!value.trim()) return 'Confirm password is required.';
        if (value !== form.password) return 'Passwords do not match.';
        break;
      default:
        return '';
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(form).forEach((field) => {
      const error = validateField(field, form[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const userData = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      role:role,
    };
    console.log(userData)

    try {
      const response = await fetch('http://localhost:5237/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.message==false) {
        setApiMessage(result.message || 'Something went wrong');
         
      }

      setApiMessage('✅ Account created successfully!');
      router.push(`/login`);
    } catch (err) {
      console.error('❌ Error:', err);
      setApiMessage('❌ Server error');
    }
  };

  const isFormValid =
    Object.values(errors).every((err) => !err) &&
    Object.values(form).every((val) => val.trim() !== '');

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold text-center text-blue-800">
          Register as {role}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-black"
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-black"
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-black"
            />
            {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-black"
            />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-black"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              isFormValid
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Create Account
          </button>

          {apiMessage && (
            <p className="text-center text-sm mt-3 text-blue-700">{apiMessage}</p>
          )}
        </form>
      </div>
    </main>
  );
}
