"use client";
import { useOrganization } from "@clerk/nextjs";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
const url =
  process.env.NODE_ENV === "development" ? "localhost:3000" : "perk.gg";

export default function VisibilityDisplay() {
  const [parent] = useAutoAnimate();
  const { data, isPending, error } = api.community.getCurrent.useQuery();
  const { organization } = useOrganization();
  const router = useRouter();

  return (
    <div ref={parent}>
      {!isPending && data && !("error" in data) && !data.public && (
        <Alert className="mx-auto mb-6 max-w-screen-sm">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription className="font-medium">
            Your community is currently not visible to others.
          </AlertDescription>
          <div className="mt-2 flex w-9 items-center gap-2">
            <Button
              onClick={() => {
                toast.warning("This feature is not available to you yet", {
                  position: "top-center",
                  description:
                    "In the meantime, you can still preview your community.",
                  className: "w-96",
                  action: (
                    <Button
                      variant="outline"
                      onClick={() => {
                        router.push(
                          `${protocol}://${organization?.slug}.${url}`,
                        );
                      }}
                    >
                      Preview
                    </Button>
                  ),
                });
              }}
            >
              Make it public
            </Button>
            <Button variant="outline" asChild>
              <a
                href={`${protocol}://${organization?.slug}.${url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Preview
              </a>
            </Button>
          </div>
        </Alert>
      )}
      {!isPending && data && "error" in data && (
        <div
          className="mb-6 border-b border-t border-destructive bg-destructive/10 p-2 text-center"
          role="alert"
        >
          <p>Error: {data.error}</p>
        </div>
      )}
      {!isPending && error && (
        <div
          className="mb-6 border-b border-t border-destructive bg-destructive/10 p-2 text-center"
          role="alert"
        >
          <p>Error: {error.message}</p>
        </div>
      )}
    </div>
  );
}
