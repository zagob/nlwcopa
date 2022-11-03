import { getToken } from "next-auth/jwt";
import type { NextApiRequest, NextApiResponse } from "next";

const secret = "asdasdqw123123";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret });
  res.send(JSON.stringify(token, null, 2));
}
