import React from "react";
import SolutionForm from "../../components/SolutionForm/SolutionForm";
import useGetUser from "../../hooks/useGetUser"; // Assuming this hook provides user object with email

const AdminPage = () => {
  const { user, loading } = useGetUser(); // Get user from your hook

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen animate-fade-in-up">
        <span className="loading loading-lg loading-spinner text-primary"></span>
      </div>
    );
  }

  // Check if user exists and if their email matches the admin email from .env
  const isAdmin = user && user.email === import.meta.env.VITE_ADMIN_MAILS;

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-4 text-center animate-fade-in-up">
        <h1 className="text-2xl font-bold text-error mb-4">
          Erişim Reddedildi
        </h1>
        <p>Bu sayfayı görüntüleme yetkiniz yok.</p>
        {/* Optionally, redirect or show a login button if not logged in at all */}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 animate-fade-in-up">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Admin Paneli - Yeni Çözüm Ekle
      </h1>
      <div className="max-w-2xl mx-auto">
        <SolutionForm userEmail={user.email} />
      </div>
    </div>
  );
};

export default AdminPage;
