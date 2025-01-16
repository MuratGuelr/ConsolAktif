import React from "react";

const CreateImage = ({ imageUrl }) => {
  return (
    <div className="px-5">
      <img
        class="h-auto max-w-full rounded-md"
        src={imageUrl}
        alt="image description"
      />
    </div>
  );
};

export default CreateImage;
