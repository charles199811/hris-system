import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type LastDayRow = {
  fullName: string
  employmentType: string
  contractEndDate: Date | null
  user: { role: string } | null
}

type Props = {
  items: LastDayRow[]
}

function labelEnum(value: string) {
  return value.replaceAll("_", " ")
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d)
}

function daysBetween(a: Date, b: Date) {
  const ms = b.getTime() - a.getTime()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

export default function LastDayList({ items }: Props) {
  const today = new Date()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Last Day (Contract End)</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Employment Type</TableHead>
              <TableHead>Last Day</TableHead>
              <TableHead>Remaining</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((e, idx) => {
              const end = e.contractEndDate ? new Date(e.contractEndDate) : null
              const remaining = end ? daysBetween(today, end) : null

              return (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{e.fullName}</TableCell>
                  <TableCell>{e.user?.role ?? "—"}</TableCell>
                  <TableCell>{labelEnum(e.employmentType)}</TableCell>
                  <TableCell>{end ? formatDate(end) : "—"}</TableCell>
                  <TableCell>
                    {remaining === null ? (
                      "—"
                    ) : remaining < 0 ? (
                      <Badge variant="destructive">Ended</Badge>
                    ) : remaining === 0 ? (
                      <Badge variant="destructive">Today</Badge>
                    ) : remaining <= 7 ? (
                      <Badge variant="default">{remaining} days</Badge>
                    ) : (
                      <Badge variant="secondary">{remaining} days</Badge>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}

            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No contract end dates found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
