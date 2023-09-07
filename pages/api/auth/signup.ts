import { NextApiRequest, NextApiResponse } from 'next';
import validator from 'validator';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as jose from 'jose';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { firstName, lastName, email, phone, city, password } = req.body;

    // 1 - Validate user inputs
    const errors: string[] = [];

    const validationSchema = [
      {
        valid: validator.isLength(firstName, { min: 1, max: 20 }),
        errorMessage: 'First name is invalid',
      },
      {
        valid: validator.isLength(lastName, { min: 1, max: 20 }),
        errorMessage: 'Last name is invalid',
      },
      {
        valid: validator.isEmail(email),
        errorMessage: 'Email is invalid',
      },
      {
        valid: validator.isMobilePhone(phone),
        errorMessage: 'Phone number is invalid',
      },
      {
        valid: validator.isLength(city, { min: 1 }),
        errorMessage: 'city is invalid',
      },
      {
        valid: validator.isStrongPassword(password),
        errorMessage: 'Password is not strong enough',
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

    // 2 - Check if email already exists
    const userWithEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithEmail) {
      return res
        .status(400)
        .json({ errorMessage: 'Email is associated with another account' });
    }

    // 3 - hash our password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4 - save User in DB
    const user = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        password: hashedPassword,
        city,
        phone,
        email,
      },
    });

    // 5 - Create JWT
    const alg = 'HS256';
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT({
      email: user.email,
    })
      .setProtectedHeader({ alg })
      .setExpirationTime('24h')
      .sign(secret);

    // Final Response
    return res.status(200).json({
      token,
    });
  }

  return res.status(404).json('Unknown endpoint');
}
