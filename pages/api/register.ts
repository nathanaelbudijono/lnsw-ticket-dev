// Type : API
//This file is used to register a new user.
//It checks if the username already exists and if not it creates a new user in the database.
//If the username already exists it sends an error message to the client.
//The client then displays the error message to the user.

import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

const salt = bcrypt.genSaltSync(5);

export default async function handleRegister(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, password } = req.body;
  if (typeof username !== "string" || typeof password !== "string") {
    return res
      .status(406)
      .json({ message: "Username or password is not a string" });
  }
  switch (req.method) {
    case "POST":
      try {
        const checkUsername = await prisma.users.findFirst({
          where: { username: username },
          select: { username: true },
        });
        if (!checkUsername) {
          const hashPassword = await bcrypt.hash(password, salt);
          const user = await prisma.users.create({
            data: {
              username: username,
              password: hashPassword,
            },
          });
          return res.status(200).json({ user });
        } else {
          return res.status(406).json({ message: "Username already exists" });
        }
      } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
      }
  }
}
