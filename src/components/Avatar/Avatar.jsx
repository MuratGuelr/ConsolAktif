import React from "react";
import useGetUser from "../../hooks/useGetUser";

const Avatar = () => {
  const { user, loading } = useGetUser();
  return (
    <>
      {loading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : (
        <div className="avatar avatar-online">
          <div className="rounded-full">
            <img src={user.photoURL} />
          </div>
        </div>
      )}
    </>
  );
};

export default Avatar;
