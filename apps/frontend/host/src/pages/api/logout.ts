import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookieHeader = req.headers.cookie || '';

  try {
    const response = await fetch(`${process.env.API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: cookieHeader,
      },
    });

    const data = await response.json();

    const cookies = response.headers.getSetCookie();

    if (cookies) {
      res.setHeader('set-cookie', cookies);
    }

    return res.status(response.status).json(data);
  } catch (error) {
    throw error;
  }
};

export default handler;
