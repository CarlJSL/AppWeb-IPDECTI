import { PrismaService } from 'src/common/prisma/prisma.service';

interface PaginationParams<T> {
  prisma: PrismaService;
  model: any; // El modelo de Prisma (ej: prisma.user, prisma.course, etc.)
  page: number;
  limit: number;
  where?: T; // Filtros opcionales
}

export async function paginate<T>({ prisma, model, page, limit, where }: PaginationParams<T>) {
  const total = await model.count({ where });

  const lastPage = Math.ceil(total / limit);
  if (page > lastPage || page < 1) {
    return {
      data: [],
      meta: {
        total,
        page,
        lastPage,
        message: 'No hay datos disponibles para esta página.',
      },
    };
  }

  const data = await model.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where,
  });

  return {
    data,
    meta: {
      total,
      page,
      lastPage,
    },
  };
}
