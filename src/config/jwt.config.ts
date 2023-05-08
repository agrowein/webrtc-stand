import {ConfigService} from '@nestjs/config';
import {JwtModuleOptions} from '@nestjs/jwt';

export default async (configService: ConfigService): Promise<JwtModuleOptions> => ({
	secretOrPrivateKey: configService.get<string>('JWT_SECRET'),
	global: true,
	signOptions: {
		expiresIn: '1d',
	}
});