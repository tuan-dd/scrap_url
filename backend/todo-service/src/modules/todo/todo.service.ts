import { prisma } from '@db/services';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import {
  AslRequestContext,
  BaseService,
  ERROR_MSG,
  ListResponseDto,
  UserTypeEnum,
} from 'node-common';
import {
  AssignUserRequestDto,
  TodoFilter,
  TodoStatusUpdateRequestDto,
  TotoCreateRequestDto,
  TotoUpdateRequestDto,
} from './dto/toto-request.dto';
import { TodoListResponseDto } from './dto/toto-reponse.dto';
import { ClientProxy } from '@nestjs/microservices';
import { TodoMessageTypeEnum } from './constants/todo-message.enum';

@Injectable({ scope: Scope.REQUEST })
export class TodoService extends BaseService<PrismaClient['todo']> {
  private todoUser: PrismaClient['todoUser'];
  private description: PrismaClient['description'];
  private subTask: PrismaClient['subTask'];
  constructor(@Inject('TODO_SERVICE') private clientProxy: ClientProxy) {
    super(prisma.todo);
    this.todoUser = prisma.todoUser;
    this.description = prisma.description;
    this.subTask = prisma.subTask;
  }

  override async joinTransaction(client: PrismaClient['todo'], tx: any) {
    this.client = client;
    this.todoUser = tx.todoUser;
    this.description = tx.description;
    this.subTask = tx.subTask;
  }

  override async leftTransaction() {
    this.client = this.defaultClient;
    this.todoUser = prisma.todoUser;
    this.description = prisma.description;
    this.subTask = prisma.subTask;
  }

  async create(payload: TotoCreateRequestDto) {
    const isPaid = AslRequestContext.ctx?.userInfo?.type === UserTypeEnum.PAID;
    const createdBy = AslRequestContext.ctx?.userInfo?.userId;
    return prisma.$transaction(async (tx) => {
      this.joinTransaction(tx.todo, tx);
      const todo = await this.client.create({
        data: {
          title: payload.title,
          createdBy: createdBy,
        },
      });

      const promiseAll: Promise<any>[] = [
        this.todoUser.createMany({
          data: { todoId: todo.id, userId: createdBy },
        }),
      ];
      if (payload.assignUserIds?.length) {
        promiseAll.push(
          this.todoUser.createMany({
            data: payload.assignUserIds.map((userId) => ({
              todoId: todo.id,
              userId,
            })),
          }),
        );
      }

      if (isPaid) {
        if (payload?.description) {
          promiseAll.push(
            this.description.create({
              data: {
                content: payload.description.content,
                todoId: todo.id,
              },
            }),
          );
        }

        if (payload?.subTask) {
          promiseAll.push(
            this.subTask.createMany({
              data: payload.subTask.map((subTask) => ({
                title: subTask.title,
                content: subTask?.content,
                todoId: todo.id,
              })),
            }),
          );
        }
      }
      await Promise.all(promiseAll);

      this.clientProxy.emit('TODO_SERVICE', {
        type: TodoMessageTypeEnum.TODO_CREATED,
        data: {
          todoId: todo.id,
          assignUserIds: [createdBy, ...payload.assignUserIds],
        },
      });

      return {
        message: 'create success',
        id: todo.id,
      };
    });
  }

  async update(id: number, payload: TotoUpdateRequestDto) {
    const isPaid = AslRequestContext.ctx?.userInfo?.type === UserTypeEnum.PAID;
    const createdBy = AslRequestContext.ctx?.userInfo?.userId;

    return prisma.$transaction(async (tx) => {
      this.joinTransaction(tx.todo, tx);

      const { count } = await this.client.updateMany({
        where: { id, createdBy },
        data: {
          title: payload.title,
        },
      });

      if (!count) {
        ERROR_MSG.NOT_FOUND('Todo not found');
      }

      if (isPaid && payload?.description) {
        await this.description.upsert({
          where: { todoId: id },
          create: {
            content: payload.description.content,
            todoId: id,
          },
          update: {
            content: payload.description.content,
          },
        });
      }
      return {
        message: 'update success',
      };
    });
  }

  async updateTodoStatus(id: number, payload: TodoStatusUpdateRequestDto) {
    const createdBy = AslRequestContext.ctx?.userInfo?.userId;
    const { count } = await this.client.updateMany({
      where: { id, createdBy },
      data: { status: payload.status },
    });

    if (!count) {
      ERROR_MSG.NOT_FOUND('Todo not found');
    }

    return {
      message: 'update success',
    };
  }

  async deleteTodo(id: number) {
    const createdBy = AslRequestContext.ctx?.userInfo?.userId;
    return this.client
      .updateMany({
        where: { id, createdBy },
        data: { deletedAt: new Date() },
      })
      .then(({ count }) => {
        if (!count) {
          ERROR_MSG.NOT_FOUND('Todo not found');
        }
        return;
      });
  }

  async deleteTasks(todoID: number, taskIds: number[]) {
    const createdBy = AslRequestContext.ctx?.userInfo?.userId;

    const todo = await this.client.findFirst({
      where: { id: todoID, createdBy },
    });

    if (!todo) {
      ERROR_MSG.NOT_FOUND('Todo not found');
    }

    await this.subTask.deleteMany({
      where: { id: { in: taskIds } },
    });
  }

  async isDone(todoId: number, taskId: number, isDone: boolean) {
    const userId = AslRequestContext.ctx?.userInfo?.userId;

    const todoUser = this.todoUser.findFirst({
      where: { todoId, userId },
    });

    if (!todoUser) {
      ERROR_MSG.NOT_FOUND('Todo not found');
    }

    return this.subTask
      .updateMany({
        where: { id: taskId },
        data: { isDone },
      })
      .then(({ count }) => {
        if (!count) {
          ERROR_MSG.NOT_FOUND('Task not found');
        }
        return {
          message: 'update success',
        };
      });
  }

  async assignUser(todoId: number, payload: AssignUserRequestDto) {
    await this.todoUser.deleteMany({
      where: { NOT: { userId: { in: payload.assignUserIds } }, todoId },
    });

    await this.todoUser.createMany({
      data: payload.assignUserIds.map((userId) => ({
        todoId: todoId,
        userId,
      })),
      skipDuplicates: true,
    });

    this.clientProxy.emit('TODO_SERVICE', {
      type: TodoMessageTypeEnum.TODO_ASSIGNED,
      data: { todoId, assignUserIds: payload.assignUserIds },
    });

    return {
      message: 'assign user success',
    };
  }

  async findAll({
    limit,
    skip,
    page,
    status,
    searches,
  }: TodoFilter): Promise<ListResponseDto<TodoListResponseDto>> {
    const userId = AslRequestContext.ctx?.userInfo?.userId;
    const where: Prisma.TodoWhereInput = { todoUser: { some: { userId } } };

    if (status?.length) {
      where.status = { in: status };
    }

    if (searches?.title) {
      where.title = { contains: searches.title, mode: 'insensitive' };
    }

    return this.client
      .findMany({
        where,
        include: {
          todoUser: { select: { userId: true } },
          description: { select: { content: true } },
        },
        take: limit,
        skip,
      })
      .then((todos) => {
        return {
          items: todos,
          totalItems: todos.length,
          totalPages: Math.ceil(todos.length / limit),
          currentPage: page,
        };
      });
  }

  async findOne(id: number) {
    const userId = AslRequestContext.ctx?.userInfo?.userId;
    return this.client
      .findFirst({
        where: { id, deletedAt: { not: null } },
        select: {
          id: true,
          title: true,
          todoUser: { select: { userId: true }, where: { userId } },
          status: true,
          description: { select: { content: true } },
          subTask: {
            select: {
              id: true,
              isDone: true,
              title: true,
              content: true,
              updatedBy: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      })
      .then((todo) => {
        if (!todo) {
          ERROR_MSG.NOT_FOUND('Todo not found');
        }
        return todo;
      });
  }
}
