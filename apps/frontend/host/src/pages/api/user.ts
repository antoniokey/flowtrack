import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookieHeader = req.headers.cookie || '';

  const response = await fetch(`${process.env.API_URL}/user/me`, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      cookie: cookieHeader,
    },
  });

  const setCookie = response.headers.getSetCookie();

  if (setCookie) {
    res.setHeader('set-cookie', setCookie);
  }

  const data = await response.json();

  return res.status(response.status).json(data);
};

export default handler;
