import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Control } from 'react-hook-form';
import UploadIcon from '../../public/upload.png';
import { trpc } from '../utils/trpc';
import SharedTooltip from './SharedTooltip';
import Link from 'next/link';

type FormReceiptInputProps = {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  customClassName?: string;
  required?: boolean;
  setValue: (name: string, value: string) => void;
  defaultValue?: string;
};

export function FormReceiptInput({
  name,
  customClassName,
  setValue,
  defaultValue,
}: FormReceiptInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedLink, setUploadedLink] = useState<string | null>(null);

  const uploadMutation = trpc.upload.uploadFile.useMutation();

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleFileUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      try {
        const base64File = await convertFileToBase64(file);
        const result = await uploadMutation.mutateAsync({
          base64File,
          fileName: file.name,
          fileType: file.type,
          folder: 'files',
        });

        if (result?.data?.link) {
          setValue(name, result.data.link);
          setUploadedLink(result.data.link);
        }
      } catch (error) {
        console.error('Upload error:', error);
      } finally {
        setIsUploading(false);
      }
    },
    [uploadMutation, name, setValue]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    accept: {
      'image/*': [],
    },
    noClick: true,
    noKeyboard: true,
  });

  // Determine the image source prioritizing uploadedLink, then defaultValue
  const imageSrc = uploadedLink || defaultValue;

  return (
    <>
      <div
        {...getRootProps()}
        className={`rounded-lg mb-5 bg-[#F0EFFE] p-5 border-dashed border-2 border-[#5B52F9] ${customClassName}`}
      >
        <input {...getInputProps()} hidden accept="image/*" />
        {isDragActive ? (
          <p className="text-[#71717A] p-6">Drop the image file here ...</p>
        ) : (
          <div
            className="h-full w-full flex items-center justify-center flex-col space-y-5"
            onClick={open}
          >
            {isUploading ? (
              <Loader2 size={40} className="animate-spin text-primary" />
            ) : (
              <>
                <Image src={UploadIcon} alt="upload icon" />
                <p className="text-[#71717A]">
                  Drag an image or click to browse
                </p>
              </>
            )}
          </div>
        )}
      </div>
      {imageSrc && (
        <div className="mt-[-16px]">
          <SharedTooltip
            visibleContent={
              <Link href="/" className="underline font-medium text-blue-500">
                {'Uploaded Receipt'}
              </Link>
            }
          >
            <Image
              alt="image"
              src={imageSrc}
              width={100}
              height={100}
              className="h-full w-full object-cover"
            />
          </SharedTooltip>
        </div>
      )}
    </>
  );
}
