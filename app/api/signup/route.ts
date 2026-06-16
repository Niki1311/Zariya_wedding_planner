import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { badRequest, ok, str } from "@/lib/api";

export async function POST(req: Request) {
  const b = await req.json();
  const email = str(b.email).toLowerCase().trim();
  const password = str(b.password);
  const name = str(b.name).trim();

  if (!email || !email.includes("@")) return badRequest("Please enter a valid email.");
  if (password.length < 6) return badRequest("Password must be at least 6 characters.");

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return badRequest("An account with this email already exists.");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      name: name || null,
      passwordHash,
      wedding: {
        create: {
          coupleNames: "",
          weddingName: "",
          location: "",
          onboardingDone: false,
        },
      },
    },
  });

  return ok({ id: user.id });
}
