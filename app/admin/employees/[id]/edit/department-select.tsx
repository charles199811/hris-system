"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Dept = { id: string; departmentName: string };

export default function DepartmentSelect({
  name,
  defaultValue,
  departments,
}: {
  name: string;
  defaultValue: string;
  departments: Dept[];
}) {
  const [value, setValue] = useState(defaultValue ?? "");

  // ✅ keep state in sync if defaultValue changes
  useEffect(() => {
    setValue(defaultValue ?? "");
  }, [defaultValue]);

  return (
    <>
      {/* ✅ this is what submits to server action */}
      <input type="hidden" name={name} value={value} />

      <Select value={value} onValueChange={setValue}>
        <SelectTrigger>
          <SelectValue placeholder="Select department" />
        </SelectTrigger>

        <SelectContent>
          {departments.map((d) => (
            <SelectItem key={d.id} value={d.id}>
              {formatEnumLabel(d.departmentName)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}

function formatEnumLabel(v: string) {
  return v
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}