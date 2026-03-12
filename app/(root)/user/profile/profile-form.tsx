"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile } from "@/lib/actions/user.actions";

type ProfileFormProps = {
  user: {
    name: string;
    email: string;
    about: string | null;
    linkedIn: string | null;
    hobbies: string | null;
    superpowers: string | null;
    mostFascinatingTrip: string | null;
    dreamTravelDestination: string | null;
    dateOfBirth: Date | null;
  };
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Saving..." : "Save Profile"}
    </Button>
  );
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [state, action] = useActionState(updateProfile, {
    success: false,
    message: "",
  });

  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={user.name} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={user.email}
            readOnly
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="about">About</Label>
          <Textarea
            id="about"
            name="about"
            defaultValue={user.about ?? ""}
            placeholder="Write a short introduction about yourself"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedIn">LinkedIn</Label>
          <Input
            id="linkedIn"
            name="linkedIn"
            type="url"
            defaultValue={user.linkedIn ?? ""}
            placeholder="https://linkedin.com/in/your-profile"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            defaultValue={user.dateOfBirth?.toISOString().slice(0, 10) ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hobbies">Hobbies</Label>
          <Textarea
            id="hobbies"
            name="hobbies"
            defaultValue={user.hobbies ?? ""}
            placeholder="Reading, football, photography..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="superpowers">Superpowers</Label>
          <Textarea
            id="superpowers"
            name="superpowers"
            defaultValue={user.superpowers ?? ""}
            placeholder="What are you exceptionally good at?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mostFascinatingTrip">Most Fascinating Trip</Label>
          <Textarea
            id="mostFascinatingTrip"
            name="mostFascinatingTrip"
            defaultValue={user.mostFascinatingTrip ?? ""}
            placeholder="Tell us about a memorable trip"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dreamTravelDestination">Dream Travel Destination</Label>
          <Input
            id="dreamTravelDestination"
            name="dreamTravelDestination"
            defaultValue={user.dreamTravelDestination ?? ""}
            placeholder="Japan, Iceland, New Zealand..."
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {!!state.message && (
          <p
            className={`text-sm ${state.success ? "text-green-600" : "text-destructive"}`}
          >
            {state.message}
          </p>
        )}
        <SubmitButton />
      </div>
    </form>
  );
}
