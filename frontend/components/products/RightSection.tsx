import React from "react";

type Props = {
  imageURL: string;
  productName: string;
  productDescription: string;
  learnMore: string;
};

const RightSection = ({
  imageURL,
  productName,
  productDescription,
  learnMore,
}: Props) => {
  return (
    <div className="max-w-7xl mx-auto px-6 mt-20">
      <div className="flex flex-wrap items-center">
        {/* Text Section */}
        <div className="w-full md:w-1/2 p-10">
          <h1 className="text-4xl font-bold mb-4">{productName}</h1>

          <p className="text-gray-600 mb-6">{productDescription}</p>

          <a
            href={learnMore}
            className="text-blue-600 font-medium hover:underline"
          >
            Learn More
          </a>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2">
          <img src={imageURL} alt={productName} className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default RightSection;
