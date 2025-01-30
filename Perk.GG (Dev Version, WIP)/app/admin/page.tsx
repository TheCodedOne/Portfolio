"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

const formSchema = z.object({
  organizationId: z.string().min(1, "Organization ID is required"),
  expiresAt: z.string().optional(),
});

export default function AdminPage() {
  const auth = useOrganization();
  const user = useUser();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationId: "",
      expiresAt: "",
    },
  });

  const createLicense = api.sdk.create.useMutation();

  if (!user.isLoaded) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-pulse text-lg font-medium text-gray-600">
                Loading...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.user?.username !== "coded") {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertTitle className="text-center font-mono text-4xl font-bold">
            You are not authorized to access this page
          </AlertTitle>
          <AlertDescription className="text-center text-lg">
            This page is only available to the administrator of the site.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.promise(
      createLicense.mutateAsync({
        organizationId: values.organizationId,
        expiresAt: values.expiresAt ? new Date(values.expiresAt) : undefined,
      }),
      {
        loading: "Creating license...",
        success: "License created successfully",
        error: "Failed to create license",
      },
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create SDK License</CardTitle>
          <CardDescription>
            Generate new SDK licenses for customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="organizationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization ID</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="Enter organization ID" {...field} />
                      </FormControl>
                      {auth.organization && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            form.setValue(
                              "organizationId",
                              auth.organization?.id ?? "",
                            )
                          }
                        >
                          Use Own ID
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={createLicense.isPending}
              >
                {createLicense.isPending ? "Creating..." : "Create License"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
