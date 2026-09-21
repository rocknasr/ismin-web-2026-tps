import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

/** What happened, for the controller to turn into a status code. */
export type RemoveResult = 'deleted' | 'not-found' | 'in-use';

@Injectable()
export class OrganisationsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Deletes an organisation, identified by its slug: the same identifier
   * the models API speaks in.
   *
   * An organisation that still owns models is not deleted. The foreign key
   * is `ON DELETE RESTRICT`, so the database would refuse anyway; checking
   * first turns a raw constraint error into a meaningful answer.
   */
  async remove(slug: string): Promise<RemoveResult> {
    const organisation = await this.prisma.organisation.findUnique({
      where: { slug },
      // _count asks the database to count the related rows, instead of
      // loading them all just to call .length on them.
      include: { _count: { select: { models: true } } },
    });

    if (!organisation) return 'not-found';
    if (organisation._count.models > 0) return 'in-use';

    await this.prisma.organisation.delete({ where: { id: organisation.id } });

    return 'deleted';
  }
}
