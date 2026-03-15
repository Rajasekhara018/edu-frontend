package com.payease.app.controller;

import com.payease.app.helper.RequestObject;
import com.payease.app.helper.ResponseObject;
import com.payease.app.model.CommissionSetting;
import com.payease.app.service.CommissionSettingService;
import com.payease.app.utility.MapperUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/commission")
@CrossOrigin("*")
public class CommissionSettingController {

    @Autowired
    CommissionSettingService commissionSettingService;

    @PostMapping("/cre")
    public ResponseObject create(@RequestBody RequestObject request) {
        ResponseObject response = new ResponseObject();
        return Optional.of(request).filter(req -> req.getReqType().equals("CREATE")).map(data -> {
            CommissionSetting setting = MapperUtility.buildMapperForIgnoreAnnotation().convertValue(data.getObject(), CommissionSetting.class);
            setting = commissionSettingService.create(setting);
            response.setStatus(true);
            response.setObject(setting);
            return response;
        }).orElseGet(() -> {
            response.setErrorMsg("invalid req");
            return response;
        });
    }

    @PostMapping("/upd")
    public ResponseObject update(@RequestBody RequestObject request) {
        ResponseObject response = new ResponseObject();
        return Optional.of(request).filter(req -> req.getReqType().equals("UPDATE")).map(data -> {
            CommissionSetting setting = MapperUtility.buildMapperForIgnoreAnnotation().convertValue(data.getObject(), CommissionSetting.class);
            setting = commissionSettingService.update(setting);
            response.setStatus(true);
            response.setObject(setting);
            response.setErrorMsg("Commission setting updated successfully");
            return response;
        }).orElseGet(() -> {
            response.setErrorMsg("invalid req");
            return response;
        });
    }

    @PostMapping("/getall")
    public ResponseObject getAll(@RequestBody RequestObject request) {
        ResponseObject response = new ResponseObject();
        response.setObject(commissionSettingService.getAll(request));
        response.setStatus(true);
        response.setErrorMsg("Commission settings retrieved successfully");
        return response;
    }

    @GetMapping("/all")
    public ResponseObject getAllList() {
        ResponseObject response = new ResponseObject();
        response.setObject(commissionSettingService.getAll());
        response.setStatus(true);
        return response;
    }

    @PostMapping(value = "/filterData", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE}, produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public ResponseObject filterData(@RequestBody RequestObject request) {
        ResponseObject response = new ResponseObject();
        response.setObject(commissionSettingService.findByData(request));
        response.setStatus(true);
        return response;
    }

    @PostMapping("/inq")
    public ResponseObject inquiry(@RequestParam("id") String id) {
        ResponseObject response = new ResponseObject();
        response.setObject(commissionSettingService.findOne(id));
        response.setStatus(true);
        response.setErrorMsg("Commission setting fetched successfully");
        return response;
    }

}
