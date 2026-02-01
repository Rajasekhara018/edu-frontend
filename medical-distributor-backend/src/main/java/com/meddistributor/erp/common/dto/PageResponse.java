package com.meddistributor.erp.common.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PageResponse<T> {
  private List<T> data;
  private int page;
  private int size;
  private long totalElements;
  private int totalPages;
}
