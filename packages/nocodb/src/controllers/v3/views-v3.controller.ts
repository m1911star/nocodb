import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PREFIX_APIV3_METABASE } from '~/constants/controllers';
import { TenantContext } from '~/decorators/tenant-context.decorator';
import { GlobalGuard } from '~/guards/global/global.guard';
import { MetaApiLimiterGuard } from '~/guards/meta-api-limiter.guard';
import { PagedResponseImpl } from '~/helpers/PagedResponse';
import { NcContext } from '~/interface/config';
import { Acl } from '~/middlewares/extract-ids/extract-ids.middleware';
import { ViewsV3Service } from '~/services/v3/views-v3.service';

@Controller()
@UseGuards(MetaApiLimiterGuard, GlobalGuard)
export class ViewsV3Controller {
  constructor(private readonly viewsV3Service: ViewsV3Service) {}

  @Get(`${PREFIX_APIV3_METABASE}/tables/:tableId/views`)
  @Acl('viewList')
  async viewList(
    @TenantContext() context: NcContext,
    @Param('tableId') tableId: string,
    @Query('includeM2M') includeM2M: string,
    @Request() req,
  ) {
    return new PagedResponseImpl(
      await this.viewsV3Service.getViews(context, {
        tableId,
        req,
      }),
    );
  }

  @Get(`${PREFIX_APIV3_METABASE}/views/:viewId`)
  @Acl('viewGet')
  async viewGet(
    @TenantContext() context: NcContext,
    @Param('viewId') viewId: string,
    @Request() req,
  ) {
    const view = await this.viewsV3Service.getView(context, {
      viewId: viewId,
      req,
    });
    return view;
  }
}
