import type { RequestAttachmentType } from "@/lib/requests/types";

export type DocumentCategory = "MY_DOCUMENT" | "COMPANY_DOCUMENT";

export type AttachmentDocumentRecord = {
  id: string;
  fileName: string;
  fileUrl: string;
  attachmentType: RequestAttachmentType;
  createdAt: Date;
  request: {
    title: string;
    user: {
      name: string | null;
    };
  };
};

export type DocumentItem = {
  id: string;
  name: string;
  category: DocumentCategory;
  attachmentType: RequestAttachmentType;
  attachmentLabel: string;
  uploadedBy: string;
  uploadedAt: string;
  sourceLabel: string;
  fileUrl: string;
};

const ATTACHMENT_LABELS: Record<RequestAttachmentType, string> = {
  GENERAL: "General file",
  MANAGER_APPROVAL: "Manager approval",
  CLAIM_RECEIPT: "Claim receipt",
};

function formatDocumentDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function mapAttachmentToDocumentItem(
  attachment: AttachmentDocumentRecord,
  category: DocumentCategory,
): DocumentItem {
  const uploadedBy =
    category === "MY_DOCUMENT"
      ? attachment.request.user.name?.trim() || "You"
      : attachment.request.user.name?.trim() || "HR";

  return {
    id: attachment.id,
    name: attachment.fileName,
    category,
    attachmentType: attachment.attachmentType,
    attachmentLabel: ATTACHMENT_LABELS[attachment.attachmentType],
    uploadedBy,
    uploadedAt: formatDocumentDate(attachment.createdAt),
    sourceLabel: attachment.request.title || "Request attachment",
    fileUrl: attachment.fileUrl,
  };
}
