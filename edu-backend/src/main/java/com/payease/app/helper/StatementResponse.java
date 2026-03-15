package com.payease.app.helper;

import lombok.Data;

import java.util.List;

@Data
public class StatementResponse {

    private List<StatementRow> rows;

    private StatementSummary summary;
}
