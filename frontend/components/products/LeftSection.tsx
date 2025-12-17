import React from "react";

type Props = {
  imageURL: string;
  productName: string;
  productDescription: string;
  tryDemo: string;
  learnMore: string;
  googlePlay: string;
  appStore: string;
};

const LeftSection = ({
  imageURL,
  productName,
  productDescription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
}: Props) => {
  return (
    <div className="max-w-7xl mx-auto px-6 mt-20">
      <div className="flex flex-wrap items-center">
        {/* Image */}
        <div className="w-full md:w-1/2">
          <img src={imageURL} alt={productName} className="w-full h-auto" />
        </div>

        {/* Content */}
        <div className="w-full md:w-1/2 p-10">
          <h1 className="text-4xl font-bold mb-4">{productName}</h1>

          <p className="text-gray-600 mb-6">{productDescription}</p>

          <div className="flex items-center gap-12">
            <a
              href={tryDemo}
              className="text-blue-600 font-medium hover:underline"
            >
              Try Demo
            </a>

            <a
              href={learnMore}
              className="text-blue-600 font-medium hover:underline"
            >
              Learn More
            </a>
          </div>

          <div className="flex items-center gap-12 mt-6">
            <a href={googlePlay}>
              <img
                src="/media/images/googlePlayBadge.svg"
                alt="Google Play"
                className="h-12"
              />
            </a>

            <a href={appStore}>
              <img
                src="/media/images/appstoreBadge.svg"
                alt="App Store"
                className="h-12"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSection;
