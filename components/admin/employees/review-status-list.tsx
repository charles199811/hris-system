import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ReviewRow = {
  status: string;
  month: Date;
  employee: {
    fullName: string;
    employmentType: string;
    user: { role: string } | null;
  };
};

type Props = {
  month: Date;
  reviews: ReviewRow[];
};

function formatMonth(d: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(d);
}

function labelEnum(value: string) {
  return value.replaceAll("_", " ");
}

function statusBadgeVariant(status: string) {
  // shadcn Badge variants: "default" | "secondary" | "destructive" | "outline"
  switch (status) {
    case "WAITING_FOR_REVIEW":
      return "secondary" as const;
    case "PROCESSING":
      return "default" as const;
    case "CONFIRMED":
      return "outline" as const;
    default:
      return "secondary" as const;
  }
}

export default function ReviewStatusList({ month, reviews }: Props) {
  const counts = reviews.reduce(
    (acc, r) => {
      acc.total += 1;
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    },
    { total: 0 } as Record<string, number>,
  );

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle>Performance Review: {formatMonth(month)}</CardTitle>
        <div className="flex flex-wrap gap-2 text-sm">
          <Badge variant="outline">Total: {counts.total ?? 0}</Badge>
          <Badge variant={statusBadgeVariant("WAITING_FOR_REVIEW")}>
            Waiting: {counts.WAITING_FOR_REVIEW ?? 0}
          </Badge>
          <Badge variant={statusBadgeVariant("PROCESSING")}>
            Processing: {counts.PROCESSING ?? 0}
          </Badge>
          <Badge variant={statusBadgeVariant("CONFIRMED")}>
            Confirmed: {counts.CONFIRMED ?? 0}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Employment Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {reviews.map((r, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">
                  {r.employee.fullName}
                </TableCell>
                <TableCell>{r.employee.user?.role ?? "—"}</TableCell>
                <TableCell>{labelEnum(r.employee.employmentType)}</TableCell>
                <TableCell>
                  <Badge variant={statusBadgeVariant(r.status)}>
                    {labelEnum(r.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}

            {reviews.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No scorecards found for this month.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
