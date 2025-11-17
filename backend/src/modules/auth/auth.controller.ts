import type { Request, Response } from "express";
import * as authService from "./auth.service.js";
import { prisma } from "../../prisma/client.js";
import { signToken } from "../../utils/jwt.js";
import crypto from "crypto"; 

export const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "Missing refresh token" });

    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored) return res.status(401).json({ message: "Invalid refresh token" });
    if (stored.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: stored.id } });
      return res.status(401).json({ message: "Refresh token expired" });
    }

    // rotate token
    const newRefreshToken = crypto.randomBytes(40).toString("hex");
    await prisma.$transaction([
      prisma.refreshToken.delete({ where: { id: stored.id } }),
      prisma.refreshToken.create({
        data: { token: newRefreshToken, userId: stored.userId, expiresAt: new Date(Date.now()+7*24*60*60*1000) },
      }),
    ]);

    const accessToken = signToken({ id: stored.userId });
    return res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};


export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    const deleted = await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    if (deleted.count === 0) {
      return res.status(400).json({ message: "Refresh token not found" });
    }

    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
