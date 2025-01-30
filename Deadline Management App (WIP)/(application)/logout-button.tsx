"use client";

import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleSignOut = () => {
    // Delete the auth cookie by setting it to expire immediately
    document.cookie = "site-auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    // Redirect to login page
    router.push("/login");
  };

  return (
    <Button variant="outline" onClick={handleSignOut}>
      Sign out
    </Button>
  );
}