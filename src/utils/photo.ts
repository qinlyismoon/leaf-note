/**
 * Turn a picked or captured image into a small JPEG data URL for local
 * storage: center-cropped to the 4:5 instance-photo frame, 600×750.
 */
export const PHOTO_WIDTH = 600;
export const PHOTO_HEIGHT = 750;

export async function compressPlantPhoto(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Could not read that image.'));
      img.src = url;
    });
    const targetRatio = PHOTO_WIDTH / PHOTO_HEIGHT;
    const sourceRatio = image.naturalWidth / image.naturalHeight;
    let sw = image.naturalWidth;
    let sh = image.naturalHeight;
    if (sourceRatio > targetRatio) {
      sw = sh * targetRatio;
    } else {
      sh = sw / targetRatio;
    }
    const sx = (image.naturalWidth - sw) / 2;
    const sy = (image.naturalHeight - sh) / 2;
    const canvas = document.createElement('canvas');
    canvas.width = PHOTO_WIDTH;
    canvas.height = PHOTO_HEIGHT;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not process that image.');
    }
    context.drawImage(image, sx, sy, sw, sh, 0, 0, PHOTO_WIDTH, PHOTO_HEIGHT);
    return canvas.toDataURL('image/jpeg', 0.75);
  } finally {
    URL.revokeObjectURL(url);
  }
}
