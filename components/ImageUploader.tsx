
import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  id: string;
  label: string;
  onImageChange: (file: File) => void;
  imagePreviewUrl?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onImageChange, imagePreviewUrl }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert("File size exceeds 10MB. Please choose a smaller image.");
        return;
      }
      onImageChange(file);
    }
  };
  
  const handleContainerClick = () => {
      inputRef.current?.click();
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2 text-center">
        {label}
      </label>
      <div
        onClick={handleContainerClick}
        className="group aspect-square w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-brand-blue hover:bg-brand-light-blue transition-all duration-300 relative overflow-hidden"
      >
        <input
          id={id}
          ref={inputRef}
          type="file"
          accept="image/jpeg, image/png"
          onChange={handleFileChange}
          className="hidden"
        />
        {imagePreviewUrl ? (
          <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-4">
            <UploadIcon className="w-12 h-12 mx-auto text-gray-400 group-hover:text-brand-blue transition-colors"/>
            <p className="mt-2 text-sm text-gray-500 group-hover:text-brand-blue">
              Click to upload or drag & drop
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
