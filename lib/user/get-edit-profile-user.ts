import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";

const editProfileUserSelect = Prisma.validator<Prisma.UserSelect>()({
  name: true,
  email: true,
  about: true,
  linkedIn: true,
  hobbies: true,
  superpowers: true,
  mostFascinatingTrip: true,
  dreamTravelDestination: true,
  dateOfBirth: true,
});

export type EditProfileUser = Prisma.UserGetPayload<{
  select: typeof editProfileUserSelect;
}>;

export async function getEditProfileUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: editProfileUserSelect,
  });
}
