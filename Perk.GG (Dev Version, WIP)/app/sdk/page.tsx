import { SDKLicensesTable } from "~/components/SDKLicenseTable";
import DownloadButton from "~/components/download-button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function SDKPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row justify-between">
          <CardTitle>SDK Licenses</CardTitle>
          <DownloadButton />
        </div>
      </CardHeader>
      <CardContent>
        <SDKLicensesTable />
      </CardContent>
    </Card>
  );
}
