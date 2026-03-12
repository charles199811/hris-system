import { prisma } from "@/db/prisma";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

type UpcomingBirthday = {
  id: string;
  name: string;
  subtitle: string;
  daysUntilBirthday: number;
};

function startOfUtcDay(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function getNextBirthday(dateOfBirth: Date, now: Date) {
  const month = dateOfBirth.getUTCMonth();
  const day = dateOfBirth.getUTCDate();
  const today = startOfUtcDay(now);

  let nextBirthday = new Date(Date.UTC(today.getUTCFullYear(), month, day));

  if (nextBirthday < today) {
    nextBirthday = new Date(
      Date.UTC(today.getUTCFullYear() + 1, month, day),
    );
  }

  return nextBirthday;
}

function formatBirthdaySubtitle(daysUntilBirthday: number, nextBirthday: Date) {
  if (daysUntilBirthday === 0) {
    return "Today";
  }

  if (daysUntilBirthday === 1) {
    return "Tomorrow";
  }

  return nextBirthday.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

function isUpcomingBirthday(
  user: UpcomingBirthday | null,
): user is UpcomingBirthday {
  return user !== null;
}

export async function getUpcomingBirthdays(limit = 10) {
  const now = new Date();
  const today = startOfUtcDay(now);

  const users = await prisma.user.findMany({
    where: {
      dateOfBirth: {
        not: null,
      },
    },
    select: {
      id: true,
      name: true,
      dateOfBirth: true,
    },
  });

  return users
    .map((user) => {
      const dateOfBirth = user.dateOfBirth;
      if (!dateOfBirth) {
        return null;
      }

      const nextBirthday = getNextBirthday(dateOfBirth, now);
      const daysUntilBirthday = Math.round(
        (nextBirthday.getTime() - today.getTime()) / MS_PER_DAY,
      );

      return {
        id: user.id,
        name: user.name?.trim() || "Employee",
        subtitle: formatBirthdaySubtitle(daysUntilBirthday, nextBirthday),
        daysUntilBirthday,
      };
    })
    .filter(isUpcomingBirthday)
    .sort((a, b) => {
      if (a.daysUntilBirthday !== b.daysUntilBirthday) {
        return a.daysUntilBirthday - b.daysUntilBirthday;
      }

      return a.name.localeCompare(b.name);
    })
    .slice(0, limit)
    .map(({ id, name, subtitle }) => ({
      id,
      name,
      subtitle,
    }));
}
