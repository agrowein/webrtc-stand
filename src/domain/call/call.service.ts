import {Injectable} from '@nestjs/common';
import {UserService} from '../user/user.service';

@Injectable()
export class CallService {
	constructor(
		private userService: UserService,
	) {}

	async call(from: string, to: string) {

	}

	async end(from: string, to: string) {

	};
}