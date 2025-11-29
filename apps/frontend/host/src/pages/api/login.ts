import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await fetch(`${process.env.API_URL}/login`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
      credentials: 'include',
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
