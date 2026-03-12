import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileForm from "../profile-form";
import { getEditProfileUser } from "@/lib/user/get-edit-profile-user";

export default async function EditProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = await getEditProfileUser(session.user.id);

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Card className="rounded-2xl border-slate-200 bg-white/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            user={{
              name: user.name ?? "",
              email: user.email,
              about: user.about,
              linkedIn: user.linkedIn,
              hobbies: user.hobbies,
              superpowers: user.superpowers,
              mostFascinatingTrip: user.mostFascinatingTrip,
              dreamTravelDestination: user.dreamTravelDestination,
              dateOfBirth: user.dateOfBirth,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
