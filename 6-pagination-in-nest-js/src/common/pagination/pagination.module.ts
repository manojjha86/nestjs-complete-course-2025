import { Module } from '@nestjs/common';
import { PaginationProvider } from './pagination.provider';

@Module({
  providers: [PaginationProvider],
  exports: [PaginationProvider]
})
export class PaginationModule {}
