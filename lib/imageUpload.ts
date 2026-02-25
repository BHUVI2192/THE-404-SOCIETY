/**
 * Image Upload Utility
 * Handles file selection and Base64 conversion for localStorage storage
 */

export interface ImageUploadResult {
  base64: string;
  filename: string;
  size: number;
  type: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Convert a File to Base64 string
 */
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Validate and process an image file
 * @returns Promise containing Base64 string or null if invalid
 */
export const processImageFile = async (file: File): Promise<ImageUploadResult | null> => {
  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}`);
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
  }

  try {
    const base64 = await convertFileToBase64(file);
    return {
      base64,
      filename: file.name,
      size: file.size,
      type: file.type,
    };
  } catch (error) {
    throw new Error('Failed to process image file');
  }
};

/**
 * Get file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Create a file input element and trigger file selection dialog
 */
export const triggerFileInput = (callback: (file: File) => void): HTMLInputElement => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = ALLOWED_TYPES.join(',');
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) callback(file);
  };
  input.click();
  return input;
};
