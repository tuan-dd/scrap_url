import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { ClientProxy } from '@nestjs/microservices';
import {
  AssignUserRequestDto,
  SubtaskDeleteRequestDto,
  SubTaskStatusUpdateRequestDto,
  TodoFilter,
  TodoStatusUpdateRequestDto,
  TotoCreateRequestDto,
  TotoUpdateRequestDto,
} from './dto/toto-request.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async create(@Body() payload: TotoCreateRequestDto) {
    await this.todoService.create(payload);

    return;
  }
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: TotoUpdateRequestDto,
  ) {
    await this.todoService.update(id, payload);
  }

  @Post(':id/assign-user')
  async assignUser(
    @Param('id') id: number,
    @Body() payload: AssignUserRequestDto,
  ) {
    return this.todoService.assignUser(id, payload);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body() payload: TodoStatusUpdateRequestDto,
  ) {
    return this.todoService.updateTodoStatus(id, payload);
  }

  @Patch(':id/subtask/:subtaskId/status')
  async updateSubTaskStatus(
    @Param('id') id: number,
    @Param('subtaskId') subtaskId: number,
    @Body() payload: SubTaskStatusUpdateRequestDto,
  ) {
    return this.todoService.isDone(id, subtaskId, payload.isDone);
  }

  @Get()
  async findAll(@Query() qs: TodoFilter) {
    return this.todoService.findAll(qs);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.todoService.findOne(id);
  }

  @Delete(':id')
  async deleteTodo(@Param('id') id: number) {
    return this.todoService.deleteTodo(id);
  }

  @Delete(':id/subtask')
  async deleteSubTask(
    @Param('id') id: number,
    @Body() body: SubtaskDeleteRequestDto,
  ) {
    return this.todoService.deleteTasks(id, body.subTaskIds);
  }
}
