import { Module } from '@nestjs/common';

/**
 * The module: the box that declares what goes together.
 *
 * 👉 Step 1: it is empty. Import and declare the controller and the service,
 *    then watch the tests start. Until then, Nest knows neither of them.
 */
@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class ModelsModule {}
