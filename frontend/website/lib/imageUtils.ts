export interface CompressResult {
  dataUrl: string;
  sizeKb: number;
}

export const compressImageToMax100KB = (file: File): Promise<CompressResult> => {
  return new Promise((resolve, reject) => {
    const MAX_BYTES = 100 * 1024; // 100 KB = 102,400 bytes

    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file (JPG, PNG, WEBP).'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (e) => {
      const originalDataUrl = e.target?.result as string;

      // If file is already <= 100KB, return directly
      if (file.size <= MAX_BYTES) {
        resolve({
          dataUrl: originalDataUrl,
          sizeKb: Math.round(file.size / 1024),
        });
        return;
      }

      // If > 100KB, perform HTML5 Canvas compression & downscaling
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid or corrupted image file.'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 800; // Max width or height

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available.'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Progressively decrease quality to fit under 100KB
        let quality = 0.85;
        let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

        while (compressedDataUrl.length * 0.75 > MAX_BYTES && quality > 0.15) {
          quality -= 0.1;
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        const sizeKb = Math.round((compressedDataUrl.length * 0.75) / 1024);

        if (sizeKb > 120) {
          reject(new Error(`Image is too large (${sizeKb} KB after compression). Please choose an image under 100KB.`));
        } else {
          resolve({
            dataUrl: compressedDataUrl,
            sizeKb,
          });
        }
      };
      img.src = originalDataUrl;
    };
    reader.readAsDataURL(file);
  });
};
