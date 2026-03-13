import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Building2,
  FileText,
  FolderOpen,
  Receipt,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  mapAttachmentToDocumentItem,
  type DocumentItem,
} from "./docUtils";

export default async function UserDocumentPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const myAttachments = await prisma.attachment.findMany({
    where: {
      request: {
        userId: session.user.id,
      },
    },
    select: {
      id: true,
      fileName: true,
      fileUrl: true,
      attachmentType: true,
      createdAt: true,
      request: {
        select: {
          title: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const myDocuments = myAttachments.map((attachment) =>
    mapAttachmentToDocumentItem(attachment, "MY_DOCUMENT"),
  );
  const companyDocuments: DocumentItem[] = [];

  const stats = [
    {
      title: "My documents",
      value: myDocuments.length,
      description: "Files attached to your requests.",
      icon: FileText,
    },
    {
      title: "Claim receipts",
      value: myDocuments.filter(
        (document) => document.attachmentType === "CLAIM_RECEIPT",
      ).length,
      description: "Receipts and payment proof for claims.",
      icon: Receipt,
    },
    {
      title: "Approvals",
      value: myDocuments.filter(
        (document) => document.attachmentType === "MANAGER_APPROVAL",
      ).length,
      description: "Manager approvals and supporting files.",
      icon: ShieldCheck,
    },
    {
      title: "Company docs",
      value: companyDocuments.length,
      description: "Shared HR files when available.",
      icon: Building2,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Review the files attached to your requests in one place. Shared
            company documents will appear here once that flow is connected.
          </p>
        </div>

        <Button asChild>
          <Link href="/user/requests">Upload through a request</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <SummaryCard key={stat.title} {...stat} />
        ))}
      </div>

      <DocumentSection
        title="My Documents"
        description="Personal files submitted with leave, claim, or support requests."
        documents={myDocuments}
        emptyMessage="No personal documents found yet. Upload a file through a request to see it here."
        emptyActionHref="/user/requests"
        emptyActionLabel="Open requests"
      />

      <DocumentSection
        title="Company Documents"
        description="Shared HR policies, letters, or templates will appear here when the shared-documents flow is added."
        documents={companyDocuments}
        emptyMessage="No shared company documents are available yet."
      />
    </div>
  );
}

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="rounded-2xl border-slate-200 bg-white/80 shadow-sm">
      <CardContent className="flex items-start justify-between p-5">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold text-slate-900">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>

        <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function DocumentSection({
  title,
  description,
  documents,
  emptyMessage,
  emptyActionHref,
  emptyActionLabel,
}: {
  title: string;
  description: string;
  documents: DocumentItem[];
  emptyMessage: string;
  emptyActionHref?: string;
  emptyActionLabel?: string;
}) {
  return (
    <Card className="rounded-2xl border-slate-200 bg-white/80 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div className="space-y-1.5">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Badge variant="secondary">{documents.length}</Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        {documents.length > 0 ? (
          documents.map((document) => (
            <div
              key={document.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="min-w-0 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-white p-2 text-slate-600 shadow-sm">
                    <FileText className="h-4 w-4 shrink-0" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">
                      {document.name}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      Linked to {document.sourceLabel}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="bg-white/70">
                    {document.attachmentLabel}
                  </Badge>
                  <span>Added by {document.uploadedBy}</span>
                  <span>{document.uploadedAt}</span>
                </div>
              </div>

              <Button asChild variant="outline" size="sm" className="w-fit">
                <Link href={document.fileUrl} target="_blank" rel="noreferrer">
                  Open file
                </Link>
              </Button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-10 text-center">
            <FolderOpen className="mb-3 h-8 w-8 text-slate-400" />
            <p className="font-medium text-slate-700">{emptyMessage}</p>

            {emptyActionHref && emptyActionLabel ? (
              <Button asChild variant="outline" className="mt-4">
                <Link href={emptyActionHref}>{emptyActionLabel}</Link>
              </Button>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
