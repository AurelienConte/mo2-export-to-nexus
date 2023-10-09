import { Module } from '@nestjs/common';
import {ConvertorModule} from "./convertor/convertor.module";

@Module({
  imports: [
    ConvertorModule
  ],
  controllers: [],
  providers: [],
})
export class CommandModule {}
