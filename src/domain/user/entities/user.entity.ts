import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity('users')
export class User {
	@PrimaryColumn()
	login: string;

	@Column({ select: false })
	password: string;
}
