import { auth } from "@clerk/nextjs/server";
import { api } from "~/trpc/server";
import { CopyToClipboardButton } from "./copy-to-clipboard-button";

export default async function DebugPage() {
  const { userId, sessionId, sessionClaims, orgId, orgRole, orgPermissions } =
    await auth();

  const licenseResult = await api.sdk.findLicensesForOrganization();

  const perms = orgPermissions ?? [];

  const debugInfo = `
UID: ${userId ?? "N/A"}
SID: ${sessionId ?? "N/A"}
SC: ${JSON.stringify(sessionClaims ?? {})}
OID: ${orgId ?? "N/A"}
OR: ${orgRole ?? "N/A"}
OP: ${perms.length > 0 ? perms.join(", ") : "N/A"}
L: ${JSON.stringify(licenseResult)}
  `.trim();

  return (
    <div className="mx-auto max-w-screen-lg py-8">
      <h1 className="mb-6 text-3xl font-bold">Debug Information</h1>
      <div className="rounded-lg bg-gray-100 p-4">
        <pre className="overflow-x-scroll text-balance text-sm">
          {debugInfo}
        </pre>
      </div>
      <div className="mt-4">
        <CopyToClipboardButton text={debugInfo} />
      </div>
    </div>
  );
}
