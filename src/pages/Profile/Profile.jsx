import React, { useEffect, useState } from "react";
import useGetUser from "../../hooks/useGetUser";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import Avatar from "../../components/Avatar/Avatar";

const Profile = () => {
  const { user, loading } = useGetUser();
  const [userName, setUsername] = useState("");
  const [createdAt, setCreatedAt] = useState(null);

  useEffect(() => {
    if (user) {
      // Firebase'den gelen createdAt (timestamp) verisi
      const timestamp = user.metadata.creationTime; // Firebase'den alınan zaman (ISO string)

      // ISO string'i timestamp'a çevirebilirsiniz
      const createdAtTimestamp = new Date(timestamp).getTime(); // milisaniye cinsinden

      setCreatedAt(createdAtTimestamp); // createdAt'ı state'e kaydediyoruz
    }
  }, [user]);

  const timeAgo = createdAt
    ? formatDistanceToNow(createdAt, { addSuffix: true, locale: tr }) // Türkçe dil desteği ekliyoruz
    : null;

  return (
    <>
      {loading && !user ? (
        <div>
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      ) : (
        <div className="hero bg-base-100 h-screen -mt-36 -mb-36">
          <div className="flex justify-center">
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4  indicator justify-center">
              <span className="indicator-item badge badge-secondary -mt-3 text-xs">
                {(timeAgo && `Hesap ${timeAgo} oluşturuldu`) || "Yükleniyor..."}
              </span>
              <div className="flex justify-center py-2">
                <Avatar />
              </div>
              <legend className="fieldset-legend">Profil</legend>

              <label className="label">Kullanıcı Adı</label>
              <input
                type="text"
                className="input"
                placeholder="kullanıcı adı"
                value={user.displayName}
                readOnly
              />

              <label className="label">E-mail</label>
              <input
                type="text"
                className="input"
                placeholder="E-mail"
                value={user.email}
                readOnly
              />
            </fieldset>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
