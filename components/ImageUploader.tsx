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
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-2 text-center">
        {label}
      </label>
      <div
        onClick={handleContainerClick}
        className="group aspect-square w-full bg-background dark:bg-card border-2 border-dashed border-input-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary hover:bg-accent transition-all duration-300 relative overflow-hidden"
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
            <UploadIcon className="w-12 h-12 mx-auto text-muted-foreground group-hover:text-primary transition-colors"/>
            <p className="mt-2 text-sm text-muted-foreground group-hover:text-primary">
              Click to upload or drag & drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;