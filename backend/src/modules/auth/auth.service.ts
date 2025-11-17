import { prisma } from "../../prisma/client.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import { signToken } from "../../utils/jwt.js";
import type { RegisterInput, LoginInput } from "./auth.types.js";
import crypto from "crypto";

export const register = async (input: RegisterInput) => {
  try {
    const hashedPassword = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
      },
    });

    const accessToken = signToken({ id: user.id });

    const refreshToken = crypto.randomBytes(40).toString("hex");

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return { user, accessToken, refreshToken };
  } catch (err: any) {
    // Handle duplicate email error
    if (err.code === "P2002" && err.meta?.target?.includes("email")) {
      throw new Error("Email already in use");
    }
    throw err;
  }
};

export const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new Error("Invalid email or password");

  const isValid = await comparePassword(input.password, user.password);
  if (!isValid) throw new Error("Invalid email or password");

  const accessToken = signToken({ id: user.id, email: user.email });

  // create refresh token
  const refreshToken = crypto.randomBytes(40).toString("hex");

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  return { user, accessToken, refreshToken };
};
