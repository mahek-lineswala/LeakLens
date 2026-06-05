import { UploadApiResponse } from 'cloudinary';
import { InternalServerError } from '@leaklens/shared';

import { cloudinary } from '../../../config/cloudinary';
import { CloudinaryUploadResult } from '../types/upload.types';

export class StorageService {
  public static async uploadFile(file: Express.Multer.File): Promise<CloudinaryUploadResult> {
    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'leaklens/uploads',
            resource_type: 'auto',
            use_filename: true,
            unique_filename: true,
            filename_override: file.originalname,
          },
          (error, response) => {
            if (error || !response) {
              reject(error ?? new Error('Cloudinary did not return a response.'));
              return;
            }

            resolve(response);
          }
        );

        uploadStream.end(file.buffer);
      });

      return {
        secureUrl: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type,
        originalFilename: result.original_filename,
        bytes: result.bytes,
        format: result.format,
      };
    } catch (error) {
      throw new InternalServerError('Failed to upload file to cloud storage.');
    }
  }

  public static async deleteFile(publicId: string, resourceType: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType || 'image',
      });
    } catch (error) {
      console.error('[LeakLens Storage] Failed to clean up Cloudinary asset', error);
    }
  }

  public static getPdfPageImageUrl(publicId: string, page: number): string {
    return cloudinary.url(publicId, {
      resource_type: 'image',
      type: 'upload',
      format: 'png',
      page,
      secure: true,
    });
  }
}
