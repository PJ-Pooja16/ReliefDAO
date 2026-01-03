
'use client';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useUser, useFirebase } from "@/firebase";
import { Loader2, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc } from "firebase/firestore";

export default function SettingsPage() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    
    const userDocRef = doc(firestore, "users", user.uid);

    try {
      await updateDoc(userDocRef, { name, email });
      toast({
        title: "Settings Saved",
        description: "Your profile information has been updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save your settings. Please try again.",
      });
    }
  };

  if (isUserLoading) {
      return (
          <>
            <PageHeader
                title="Settings"
                description="Manage your account settings and preferences."
            />
            <div className="container pb-8 text-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mx-auto"/>
            </div>
          </>
      )
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences."
      />
      <div className="container pb-8">
        <Card className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your personal information. This is how you'll be identified in the DAO.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="name" name="name" defaultValue={user?.displayName || ""} placeholder="Your Name" className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                 <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" name="email" type="email" defaultValue={user?.email || ""} placeholder="your@email.com" className="pl-9" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button>Save Changes</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
