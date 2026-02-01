package com.meddistributor.erp.common.util;

import java.time.LocalDate;

public final class DateUtil {
  private DateUtil() {}

  public static String financialYear(LocalDate date) {
    int year = date.getYear();
    int startYear = date.getMonthValue() >= 4 ? year : year - 1;
    int endYear = startYear + 1;
    return String.format("%d-%02d", startYear, endYear % 100);
  }
}
