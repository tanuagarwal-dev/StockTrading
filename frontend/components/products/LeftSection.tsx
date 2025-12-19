import Link from "next/link";
import Image from "next/image";

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
        <div className="w-full md:w-1/2">
          <Image
            src={imageURL}
            alt={productName}
            width={600}
            height={400}
            className="w-full h-auto"
          />
        </div>

        <div className="w-full md:w-1/2 p-10">
          <h1 className="text-4xl font-bold mb-4">{productName}</h1>

          <p className="text-gray-600 mb-6">{productDescription}</p>

          <div className="flex items-center gap-12">
            <Link
              href={tryDemo}
              className="text-blue-600 font-medium hover:underline"
            >
              Try Demo
            </Link>

            <Link
              href={learnMore}
              className="text-blue-600 font-medium hover:underline"
            >
              Learn More
            </Link>
          </div>

          <div className="flex items-center gap-12 mt-6">
            <Link href={googlePlay} target="_blank" rel="noopener noreferrer">
              <Image
                src="/media/images/googlePlayBadge.svg"
                alt="Google Play"
                width={135}
                height={48}
                sizes="135px"
                className="h-12"
              />
            </Link>

            <Link href={appStore} target="_blank" rel="noopener noreferrer">
              <Image
                src="/media/images/appstoreBadge.svg"
                alt="App Store"
                width={135}
                height={48}
                sizes="135px"
                className="h-12"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSection;
