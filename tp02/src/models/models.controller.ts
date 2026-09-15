import { Controller } from '@nestjs/common';
import { ModelsService } from './models.service.js';

/**
 * The controller: it translates HTTP ↔ domain. No business logic here.
 *
 * Everything is yours to write: the tests in `test/models.e2e-spec.ts`
 * describe the expected behaviour precisely.
 *
 * Routes to expose:
 *   GET    /models              → list (with ?org= and ?task= filters)
 *   GET    /models/:id          → one model, or 404
 *   POST   /models              → creation, status 201
 *   DELETE /models/:id          → removal, status 204, or 404
 */
@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  // 👉 Your turn.
}
