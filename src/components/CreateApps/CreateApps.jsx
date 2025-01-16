import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../firebase/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Navbar from "../../pages/Navbar/Navbar";
import Footer from "../../pages/Footer/Footer";
import Header from "../Header/Header";
import CreateImage from "../CreateImage/CreateImage";
import CreateText from "../CreateText/CreateText";

const CreateApps = () => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Görsel URL
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false); // Modal kontrolü

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => Math.max(1, prev - 1));

  const handleSavePost = async () => {
    const postId = uuidv4();
    const newPost = {
      id: postId,
      title,
      content,
      image: imageUrl, // Görsel URL'si
      createdAt: new Date().toISOString(),
    };

    try {
      const postsCollection = collection(db, "posts");
      const postDoc = doc(postsCollection, postId);
      await setDoc(postDoc, newPost);
      toast.success("Yazı başarıyla kaydedildi!");
    } catch (error) {
      console.error("Yazı kaydedilirken bir hata oluştu:", error);
      toast.error("Yazı kaydedilirken bir hata oluştu!");
    }
  };

  return (
    <div className="p-5 flex">
      {/* Form bölgesi */}
      <div className="w-1/2 max-w-lg mx-auto p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md text-white">
        {step === 1 && (
          <div>
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Başlık
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-50 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white"
              placeholder="Başlık girin..."
              required
            />
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Next
            </button>
          </div>
        )}
        {step === 2 && (
          <div>
            <label
              htmlFor="imageUrl"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Görsel URL
            </label>
            <input
              type="text"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-50 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white"
              placeholder="Görsel URL'si girin..."
              required
            />
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <label
              htmlFor="content"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              İçerik (Markdown Destekli)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 h-40 mb-4 bg-gray-50 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white"
              placeholder="Markdown ile yazın..."
              required
            />
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              >
                Back
              </button>
              <button
                onClick={() => setShowPreview(true)} // Önizleme modalını aç
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
              >
                Önizle
              </button>
              <button
                onClick={handleSavePost}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Kaydet
              </button>
            </div>
          </div>
        )}
      </div>

      {showPreview && (
        <div className="absolute inset-0 border-gray-700 border-2 bg-opacity-50 top-0 items-center justify-center text-white p-6">
          <div className="relative  rounded-lg w-full max-w-4xl mx-auto shadow-lg overflow-hidden bg-gray-900 border-gray-700 border-[10px] ">
            <button
              className="absolute right-2 top-2 z-50 text-xl font-bold bg-red-600 p-2 px-3 py-1 rounded-md hover:bg-red-500"
              onClick={() => setShowPreview(false)}
            >
              X
            </button>
            <div className="flex flex-col space-y-4 px-6 py-4">
              <Navbar />
              <Header title={title} />

              {/* Görsel */}
              {imageUrl && <CreateImage imageUrl={imageUrl} />}

              <CreateText text={text} />

              {/* İçerik */}
              <div className="markdown-body bg-gray-50 dark:bg-gray-800 rounded-lg p-4 overflow-auto max-h-[350px]">
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
              </div>

              <Footer />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateApps;
