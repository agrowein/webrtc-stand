import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../domain/user/entities/user.entity";
import { Repository } from "typeorm";
import {SignInDto} from './dto/SignIn.dto';
import {SignUpDto} from './dto/SignUp.dto';
import {compare, hash} from "bcrypt";
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class AuthService {

	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
		private jwtService: JwtService,
	) {}

	async login({ login, password }: SignInDto) {
		const user = await this.userRepository.findOne({ where: { login }, select: { password: true } });
		if (!user) throw new Error('Пользователя с таким login не существует!');

		const hash = user.password;

		const passIsCorrect = await compare(password, hash);

		if (!passIsCorrect) throw new Error('Неверный пароль!');

		return {
			accessToken: await this.jwtService.signAsync({ login }),
		};
	}

	async register({ login, password }: SignUpDto) {
		const user = await this.userRepository.findOne({ where: { login } });
		if (user) throw new Error('Пользователь с таким login уже зарегистрирован');

		const newUser = this.userRepository.create({ login, password });
		newUser.password = await hash(password, 10);

		try {
			await this.userRepository.save(newUser);
		} catch (e) {
			throw new Error('Не удалось создать нового пользователя');
		}
	}
}
