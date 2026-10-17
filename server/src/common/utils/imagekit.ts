import ImageKit from "imagekit";
import { env } from "../config/env.js";

let client: ImageKit | null = null;

function getClient(): ImageKit {
  if (!client) {
    client = new ImageKit({
      publicKey: env.IMAGEKIT_PUBLIC_KEY,
      privateKey: env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
    });
  }
  return client;
}

export interface UploadedFile {
  fileId: string;
  name: string;
  filePath: string;
  size: number;
}

export async function uploadPrivateFile(params: {
  buffer: Buffer;
  fileName: string;
  folder: string;
}): Promise<UploadedFile> {
  const res = await getClient().upload({
    file: params.buffer,
    fileName: params.fileName,
    folder: params.folder,
    isPrivateFile: true, // private storage; only reachable via signed URLs
    useUniqueFileName: true,
  });
  return { fileId: res.fileId, name: res.name, filePath: res.filePath, size: res.size };
}

/** Short-lived signed URL for a private file (default 5 min). */
export function getSignedUrl(filePath: string, expireSeconds = 300): string {
  return getClient().url({ path: filePath, signed: true, expireSeconds });
}

export async function deletePrivateFile(fileId: string): Promise<void> {
  await getClient().deleteFile(fileId);
}