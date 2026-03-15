package com.payease.app.helper;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class StatementRequest {

    private LocalDateTime fromDate;
    private LocalDateTime toDate;

    private String searchReference;
}
