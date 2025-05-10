import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import SolutionForm from "../../components/SolutionForm/SolutionForm";
import useGetUser from "../../hooks/useGetUser";

const EditSolutionPage = () => {
  const { solutionId } = useParams();
  const navigate = useNavigate();
  const { user, loading: userLoading } = useGetUser();

  const isAdmin = user && user.email === import.meta.env.VITE_ADMIN_MAILS;

  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-lg loading-spinner text-primary"></span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-error mb-4">
          Erişim Reddedildi
        </h1>
        <p>Çözümleri düzenleme yetkiniz yok.</p>
        {/* Optionally, redirect to login or forum */}
      </div>
    );
  }

  const handleFormSubmit = () => {
    // Navigate back to the solution detail page or forum page after successful edit
    navigate(`/forum/solution/${solutionId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Çözümü Düzenle</h1>
      <div className="max-w-2xl mx-auto">
        {/* Pass solutionId and userEmail to SolutionForm */}
        <SolutionForm
          userEmail={user.email}
          solutionId={solutionId}
          onFormSubmit={handleFormSubmit}
        />
      </div>
    </div>
  );
};

export default EditSolutionPage;
