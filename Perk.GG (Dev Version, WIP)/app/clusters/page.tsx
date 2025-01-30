"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ClustersHeader } from "~/components/ClustersHeader";
import { ClustersTable } from "~/components/ClustersTable";
import { ClustersWarning } from "~/components/ClustersWarning";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export default function Page() {
  const [contentAnimate] = useAutoAnimate();

  return (
    <Card className="@container">
      <CardHeader className="flex flex-row justify-between px-7">
        <ClustersHeader />
      </CardHeader>
      <CardContent ref={contentAnimate}>
        <ClustersWarning />
        <ClustersTable />
      </CardContent>
    </Card>
  );
}
