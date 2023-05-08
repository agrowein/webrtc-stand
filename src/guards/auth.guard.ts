import {CanActivate, ExecutionContext, Inject, Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		@Inject(JwtService) private jwtService: JwtService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const authorization = request.headers.authorization;
		const token = authorization ? authorization.split(' ')[1] : '';

		try {
			request.user = await this.jwtService.verifyAsync(token);
			return true;
		} catch (e) {
			return false;
		}
	}
}