package com.payease.app.controller;

import com.payease.app.helper.ResponseObject;
import com.payease.app.helper.StatementRequest;
import com.payease.app.helper.StatementResponse;
import com.payease.app.service.StatementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/statements")
@CrossOrigin("*")
public class StatementController {

    @Autowired
    private StatementService statementService;

    @PostMapping("/generate")
    public ResponseObject generateStatement(@RequestBody StatementRequest request) {
        ResponseObject response = new ResponseObject();
        StatementResponse statement = statementService.generateStatement(request.getFromDate(), request.getToDate(), request.getSearchReference());
        response.setStatus(true);
        response.setObject(statement);
        return response;
    }
}
