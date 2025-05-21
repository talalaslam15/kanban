import { JwtModule } from '@nestjs/jwt';

JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '7d' },
});
