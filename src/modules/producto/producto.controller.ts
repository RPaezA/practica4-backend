import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors, Res } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiBearerAuth()
@ApiTags('producto')
@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) { }

  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productoService.create(createProductoDto);
  }

  @Get()
  findAll() {
    return this.productoService.findAll();
  }

  @Get('back')
  async backend(@Req() req: Request) {
    const builder = await this.productoService.queryBuilder('productos')
      .leftJoinAndSelect('productos.categoria', 'categoria');

    if (req.query.q) {
      builder.where("productos.nombre LIKE :q", { q: `%${req.query.q}%` })
    }

    const sort: any = req.query.sort;
    if (sort) {
      builder.orderBy('productos.precio', sort.toUpperCase());
    }

    const page: number = parseInt(req.query.page as any) || 1;

    const limit = parseInt(req.query.limit as any) || 10;;

    builder.offset((page - 1) * limit).limit(limit)

    const total = await builder.getCount();

    return {
      data: await builder.getMany(),
      total: total,
      page: page,
      last_page: Math.ceil(total / limit)
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productoService.update(+id, updateProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productoService.remove(+id);
  }


  @Post(':id/actualizar-img')
  @UseInterceptors(FileInterceptor('imagen', {
    storage: diskStorage({
      destination: './files',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 9);
        const ext = extname(file.originalname);
        const filename = `${file.originalname}-${uniqueSuffix}${ext}`;
        callback(null, filename)
      }
    })
  }))


  @Get('file/:img')
  getArchivoFile(@Param('img') imagen, @Res() res) {

    return res.sendFile(imagen, { root: 'files' })

  }

}
