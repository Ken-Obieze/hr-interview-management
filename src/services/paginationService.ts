interface PaginationParams {
    total: number;
    page: number;
    limit: number;
  }
  
  export class PaginationService {
    getPaginationInfo(params: PaginationParams) {
      const { total, page, limit } = params;
      
      const pages = Math.ceil(total / limit);
      const from = (page - 1) * limit + 1;
      const to = Math.min(page * limit, total);
      
      return {
        total,
        current: page,
        from: total > 0 ? from : 0,
        to: total > 0 ? to : 0,
        pages,
      };
    }
  }
