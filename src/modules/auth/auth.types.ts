export type JwtPayload = {
  email: string;
  sub: number;
};

export type JwtPayloadWithRefreshToken = JwtPayload & { refreshToken: string };
