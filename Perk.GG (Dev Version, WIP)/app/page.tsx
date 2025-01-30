"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ClustersHeader } from "~/components/ClustersHeader";
import { ClustersTable } from "~/components/ClustersTable";
import { ClustersWarning } from "~/components/ClustersWarning";
import DownloadButton from "~/components/download-button";
import { SDKLicensesTable } from "~/components/SDKLicenseTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

function SDKLicensesCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row justify-between">
          <div>
            <CardTitle>SDK Licenses</CardTitle>
            <CardDescription>Overview of your SDK licenses</CardDescription>
          </div>
          <div className="">
            <DownloadButton />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <SDKLicensesTable />
      </CardContent>
    </Card>
  );
}

function ClustersCard() {
  const [contentAnimate] = useAutoAnimate();

  return (
    <Card>
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

export default function Home() {
  return (
    <div>
      {/* <VisibilityDisplay /> */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <SDKLicensesCard />
        <ClustersCard />
      </div>
    </div>
  );
}
