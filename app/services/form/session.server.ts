import { createCookieSessionStorage } from "remix";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__new_call",
      secure: process.env.NODE_ENV === "production", // enable this in prod only,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secrets: [process.env.FORM_SESSION_SECRET ?? "S3cr3tS3cr3ts"],
    },
  });

export { getSession, commitSession, destroySession };
