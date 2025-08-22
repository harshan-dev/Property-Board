import { Property } from "@/types/property";
import Image from "next/image";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const getImageSrc = () => {
    if (!property.image) return "/no-available-photo.jpg";

    // If it's a local upload, prepend the backend URL
    if (property.image.startsWith("/uploads/")) {
      return `http://localhost:5000${property.image}`;
    }

    // otherwise, use the image as it is (for external URLs)
    return property.image;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={getImageSrc()}
          alt={property.title}
          fill
          className="object-cover"
          onError={(e) => {
            e.currentTarget.src = "/no-available-photo.jpg";
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {property.title}
        </h3>
        <p className="text-2xl font-bold text-blue-600 mb-2">
          ${property.price.toLocaleString()}
        </p>
        <p className="text-gray-600 mb-3">📍 {property.location}</p>
        {property.description && (
          <p className="text-gray-700 text-sm line-clamp-3">
            {property.description}
          </p>
        )}
      </div>
    </div>
  );
}
