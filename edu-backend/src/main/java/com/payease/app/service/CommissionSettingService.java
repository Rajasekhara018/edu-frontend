package com.payease.app.service;

import com.payease.app.IDao.IGenericDao;
import com.payease.app.dao.CommissionSettingDao;
import com.payease.app.helper.CommissionResult;
import com.payease.app.helper.PaymentMethodCommission;
import com.payease.app.helper.RequestObject;
import com.payease.app.model.CommissionSetting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service("commissionSettingService")
public class CommissionSettingService {

    @Autowired
    IGenericDao<CommissionSetting> genericDao;

    @Autowired
    CommissionSettingDao commissionSettingDao;

    public CommissionSetting create(CommissionSetting setting) {
        return genericDao.create(setting);
    }

    public CommissionSetting findOne(String id) {
        return genericDao.fineOne(id);
    }

    public List<CommissionSetting> getAll() {
        return genericDao.getAll();
    }

    public Page<CommissionSetting> getAll(RequestObject request) {
        return genericDao.getAll(request);
    }

    public CommissionSetting update(CommissionSetting setting) {
        return genericDao.update(setting);
    }

    public List<CommissionSetting> findByData(RequestObject request) {
        return commissionSettingDao.findByData(request);
    }

    public PaymentMethodCommission getCommissionRule(String gateway, String paymentMode, String paymentType) {
        CommissionSetting setting = commissionSettingDao.findByGateway(gateway);
        if (setting == null) {
            throw new RuntimeException("Commission config not found for gateway " + gateway);
        }
        return setting.getPaymentMethods().stream().filter(p -> p.getPaymentMode().equalsIgnoreCase(paymentMode) && (p.getPaymentType().equalsIgnoreCase(paymentType) || p.getPaymentType().equalsIgnoreCase("DEFAULT"))).findFirst().orElseThrow(() -> new RuntimeException("Commission rule not configured"));
    }

    public CommissionResult calculateCommission(BigDecimal amount, PaymentMethodCommission rule) {
        BigDecimal distributor = amount.multiply(rule.getDistributorPercent()).divide(BigDecimal.valueOf(100),2, RoundingMode.HALF_UP);
        BigDecimal agent = amount.multiply(rule.getAgentPercent()).divide(BigDecimal.valueOf(100),2, RoundingMode.HALF_UP);
        BigDecimal platform = amount.multiply(rule.getPlatformPercent()).divide(BigDecimal.valueOf(100),2, RoundingMode.HALF_UP);  //₹50.235 → ₹50.24
        return new CommissionResult(distributor, agent, platform);
    }

}
