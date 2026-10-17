import { and, asc, eq } from "drizzle-orm";
import { db } from "../../common/db/index.js";
import { ApiError } from "../../common/utils/ApiError.js";
import {
  ALLOWED_RESUME_MIME,
  MAX_RESUME_BYTES,
} from "../../common/middleware/upload.middleware.js";
import {
  deletePrivateFile,
  getSignedUrl,
  uploadPrivateFile,
} from "../../common/utils/imagekit.js";
import type { CreateResumeBody, UpdateResumeBody } from "./dto/resumes.dto.js";
import { resumeVersions, type ResumeVersion } from "./resumes.models.js";

type UploadedMulterFile = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
};

function validateFile(file: UploadedMulterFile) {
  if (!ALLOWED_RESUME_MIME.has(file.mimetype)) {
    throw ApiError.badRequest("Unsupported file type. Allowed: PDF, DOC, DOCX");
  }
  if (file.size > MAX_RESUME_BYTES) throw ApiError.badRequest("File exceeds 5 MB limit");
}

export async function listResumes(ownerId: string): Promise<ResumeVersion[]> {
  return db
    .select()
    .from(resumeVersions)
    .where(eq(resumeVersions.ownerId, ownerId))
    .orderBy(asc(resumeVersions.label));
}

async function loadOwned(ownerId: string, id: string): Promise<ResumeVersion> {
  const [row] = await db
    .select()
    .from(resumeVersions)
    .where(and(eq(resumeVersions.id, id), eq(resumeVersions.ownerId, ownerId)))
    .limit(1);
  if (!row) throw ApiError.notFound("Resume not found");
  return row;
}

export async function getResumeById(ownerId: string, id: string) {
  const row = await loadOwned(ownerId, id);
  // Freshly sign on each read so the URL stays short-lived (PRD §12, §24).
  const downloadUrl = row.filePath ? getSignedUrl(row.filePath) : null;
  return { ...row, downloadUrl };
}

export async function getSignedDownloadUrl(ownerId: string, id: string) {
  const row = await loadOwned(ownerId, id);
  if (!row.filePath) throw ApiError.badRequest("This resume has no uploaded file");
  return { url: getSignedUrl(row.filePath), expiresInSeconds: 300 };
}

export async function createResume(
  ownerId: string,
  body: CreateResumeBody,
  file?: UploadedMulterFile,
): Promise<ResumeVersion> {
  let uploaded: Awaited<ReturnType<typeof uploadPrivateFile>> | null = null;
  if (file) {
    validateFile(file);
    uploaded = await uploadPrivateFile({
      buffer: file.buffer,
      fileName: file.originalname,
      folder: `/resumes/${ownerId}`,
    });
  }

  return db.transaction(async (tx) => {
    if (body.isDefault) {
      await tx
        .update(resumeVersions)
        .set({ isDefault: false })
        .where(eq(resumeVersions.ownerId, ownerId));
    }

    const [row] = await tx
      .insert(resumeVersions)
      .values({
        ownerId,
        label: body.label,
        notes: body.notes ?? null,
        isDefault: body.isDefault ?? false,
        coverLetterUrl: body.coverLetterUrl ?? null,
        portfolioUrl: body.portfolioUrl ?? null,
        storageKey: uploaded?.fileId ?? null,
        fileName: uploaded?.name ?? null,
        filePath: uploaded?.filePath ?? null,
        fileSize: file?.size ?? null,
        mimeType: file?.mimetype ?? null,
      })
      .returning();
    return row;
  });
}

export async function updateResume(
  ownerId: string,
  id: string,
  body: UpdateResumeBody,
  file?: UploadedMulterFile,
): Promise<ResumeVersion> {
  const existing = await loadOwned(ownerId, id);

  let uploaded: Awaited<ReturnType<typeof uploadPrivateFile>> | null = null;
  if (file) {
    validateFile(file);
    uploaded = await uploadPrivateFile({
      buffer: file.buffer,
      fileName: file.originalname,
      folder: `/resumes/${ownerId}`,
    });
  }

  const updated = await db.transaction(async (tx) => {
    if (body.isDefault) {
      await tx
        .update(resumeVersions)
        .set({ isDefault: false })
        .where(eq(resumeVersions.ownerId, ownerId));
    }

    const patch: Partial<ResumeVersion> = { updatedAt: new Date() };
    if (body.label !== undefined) patch.label = body.label;
    if (body.notes !== undefined) patch.notes = body.notes;
    if (body.isDefault !== undefined) patch.isDefault = body.isDefault;
    if (body.coverLetterUrl !== undefined) patch.coverLetterUrl = body.coverLetterUrl;
    if (body.portfolioUrl !== undefined) patch.portfolioUrl = body.portfolioUrl;
    if (uploaded) {
      patch.storageKey = uploaded.fileId;
      patch.fileName = uploaded.name;
      patch.filePath = uploaded.filePath;
      patch.fileSize = file!.size;
      patch.mimeType = file!.mimetype;
    }

    const [row] = await tx
      .update(resumeVersions)
      .set(patch)
      .where(and(eq(resumeVersions.id, id), eq(resumeVersions.ownerId, ownerId)))
      .returning();
    return row;
  });

  // Replace succeeded in DB → best-effort remove the old private file.
  if (uploaded && existing.storageKey) {
    await deletePrivateFile(existing.storageKey).catch(() => undefined);
  }
  return updated;
}

export async function setDefault(ownerId: string, id: string): Promise<ResumeVersion> {
  await loadOwned(ownerId, id);
  return db.transaction(async (tx) => {
    await tx
      .update(resumeVersions)
      .set({ isDefault: false })
      .where(eq(resumeVersions.ownerId, ownerId));
    const [row] = await tx
      .update(resumeVersions)
      .set({ isDefault: true, updatedAt: new Date() })
      .where(and(eq(resumeVersions.id, id), eq(resumeVersions.ownerId, ownerId)))
      .returning();
    return row;
  });
}

export async function deleteResume(ownerId: string, id: string): Promise<void> {
  const existing = await loadOwned(ownerId, id);
  // applications.resumeVersionId is ON DELETE SET NULL, so applications are preserved.
  await db
    .delete(resumeVersions)
    .where(and(eq(resumeVersions.id, id), eq(resumeVersions.ownerId, ownerId)));
  if (existing.storageKey) await deletePrivateFile(existing.storageKey).catch(() => undefined);
}