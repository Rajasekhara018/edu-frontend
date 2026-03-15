package com.payease.app.controller;

import com.payease.app.helper.CreatePaymentRequest;
import com.payease.app.helper.CreatePaymentResponse;
import com.payease.app.helper.RequestObject;
import com.payease.app.helper.ResponseObject;
import com.payease.app.model.PaymentGatewayTransaction;
import com.payease.app.service.PaymentGatewayService;
import com.payease.app.utility.MapperUtility;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin("*")
@Slf4j
public class PaymentGatewayController {

    @Autowired
    PaymentGatewayService paymentService;

    @Value("${edubackend.merchant.token}")
    private String token;

    @Value("${edubackend.merchant.currency}")
    private String currency;

    @Value("${edubackend.merchant.terminal}")
    private String terminalNo;

    @Value("${toucan.gateway-url}")
    private String gatewayUrl;


    @PostMapping("/create-payment")
    public ResponseEntity<ResponseObject> createPayment(@RequestBody RequestObject reqst) {
        ResponseObject res = new ResponseObject();
        return Optional.ofNullable(reqst)
                .filter(req -> "CREATE".equals(req.getReqType()))
                .map(data -> {
                    CreatePaymentRequest request =
                            MapperUtility.buildMapperForIgnoreAnnotation()
                                    .convertValue(data.getObject(), CreatePaymentRequest.class);
                    PaymentGatewayTransaction txn = paymentService.createPayment(request);
                    CreatePaymentResponse response = new CreatePaymentResponse();
                    res.setStatus(true);
                    response.setAmount(request.getAmount());
                    response.setCheckoutUrl(gatewayUrl);
                    response.setToken(token);
                    response.setTerminalNo(terminalNo);
                    response.setCustomerName(request.getCustomerName());
                    response.setCustomerMobileNo(request.getCustomerMobileNo());
                    response.setCustomerEmailId(request.getCustomerEmailId());
                    res.setObject(response);
                    return ResponseEntity.ok(res);
                })
                .orElseGet(() -> {
                    res.setStatus(false);
                    res.setErrorMsg("Invalid request type");
                    return ResponseEntity.badRequest().body(res);
                });
    }
}
