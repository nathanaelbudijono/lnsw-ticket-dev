//Type : Function
//This file is used to run a function that returns the user state from server side.
//If there is no token, the user will be redirected to the login page.

import jwt from "jsonwebtoken";
import { GetServerSidePropsContext } from "next";
export async function getUser(ctx: GetServerSidePropsContext) {
  const token = ctx.req.cookies.token as string;
  if (token) {
    const userToken = await new Promise((resolve, reject) => {
      jwt.verify(
        token.substring(1, token.length - 1),
        process.env.TOKEN_SECRET as string,
        {},
        (err, token) => {
          if (err) {
            reject(err);
          }
          resolve(token);
        }
      );
    });
    return {
      props: {
        user: userToken,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
}
