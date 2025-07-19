'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'Email is required.';
        if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email format.';
        break;
      case 'password':
        if (!value.trim()) return 'Password is required.';
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

    const loginData = {
      Email: form.email,
      Password: form.password,
    };

    try {
      const res = await fetch('http://localhost:5237/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const result = await res.json();

      if (!result.success) {
        setMessage(result.message || 'Login failed');
        return;
      }

      const token = result.data;
      if (token) {
        // تخزين التوكن في كوكي
        document.cookie = `Authorization=Bearer ${token}; secure; samesite=strict`;

        // استخراج الـ payload
        const payload = JSON.parse(atob(token.split('.')[1]));

        // استخراج الدور
        const role =
          payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

        console.log('✅ Role:', role);

        if (role === 'Admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/display';
        }
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setMessage('Login error. Please try again.');
    }
  };


  const isFormValid =
    Object.values(errors).every((err) => !err) &&
    Object.values(form).every((val) => val.trim() !== '');

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold text-center text-blue-800">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
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
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
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
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Message */}
          {message && (
            <div className="text-sm text-center text-red-600">{message}</div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-3 rounded-xl font-semibold transition ${isFormValid
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
