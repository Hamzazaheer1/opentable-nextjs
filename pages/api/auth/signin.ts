import { NextApiRequest, NextApiResponse } from 'next';
import validator from 'validator';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as jose from 'jose';
import { setCookie } from 'cookies-next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // 1 - Validate user inputs
    const errors: string[] = [];

    const validationSchema = [
      {
        valid: validator.isEmail(email),
        errorMessage: 'Email is invalid',
      },
      {
        valid: validator.isLength(password, { min: 1 }),
        errorMessage: 'Password is not invalid ',
      },
    ];

    validationSchema.forEach((check) => {
      if (!check.valid) {
        errors.push(check.errorMessage);
      }
    });

    if (errors.length) {
      return res.status(400).json({ errorMessage: errors[0] });
    }

    // 2 - Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ errorMessage: 'Email or password is invalid' });
    }

    // 3 -
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ errorMessage: 'Email or password is invalid' });
    }

    // 4 - Create JWT
    const alg = 'HS256';
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new jose.SignJWT({
      email: user.email,
    })
      .setProtectedHeader({ alg })
      .setExpirationTime('24h')
      .sign(secret);

    //  5 - Set Cookie in browser
    setCookie('jwt', token, { req, res, maxAge: 60 * 6 * 24 });

    // Final Response
    return res.status(200).json({
      firstNmae: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
      city: user.city,
    });
  }

  return res.status(404).json('Unknown endpoint');
}
