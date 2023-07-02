export type JwtPayload = {
  email: string;
  firstName: string;
  lastName: string;
  sub: number;
};

export type JwtPayloadWithRefreshToken = JwtPayload & { refreshToken: string };
