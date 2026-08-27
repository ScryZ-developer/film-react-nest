import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class DevLogger extends ConsoleLogger {}
