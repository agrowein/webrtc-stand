import {Module} from '@nestjs/common';
import {UserModule} from '../user/user.module';
import {CallGateway} from './call.gateway';
import {CallService} from './call.service';
import {WsGuard} from '../../guards/ws.guard';

@Module({
	imports: [UserModule],
	providers: [CallService, CallGateway, WsGuard],
	exports: [CallService],
})
export class CallModule {}