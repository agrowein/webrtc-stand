import {CanActivate, ExecutionContext, Inject, Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class WsGuard implements CanActivate {
	constructor(
		@Inject(JwtService) private jwtService: JwtService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const client = context.switchToWs().getClient();
		const authorization = client.handshake.headers.authorization;

		if (!authorization) {
			client.emit('error', '401 Authorization');
			return false;
		}

		const token = authorization.split(' ')[1] ?? '';

		if (token) {
			const payload = await this.jwtService.verifyAsync(token);

			client.user = { login: payload.login };
			return true;
		}

		client.emit('error', '401 Authorization');
		return false;
	}

}