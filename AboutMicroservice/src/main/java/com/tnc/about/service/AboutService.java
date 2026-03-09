package com.tnc.about.service;

import com.tnc.about.model.AboutInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AboutService {

    @Value("${app.about.company-name:StockFolio Technologies Pvt. Ltd.}")
    private String companyName;

    @Value("${app.about.company-id:SF-2026-001}")
    private String companyId;

    @Value("${app.about.gst-number:27AALCS1234F1Z5}")
    private String gstNumber;

    @Value("${app.about.pan-number:AALCS1234F}")
    private String panNumber;

    @Value("${app.about.cin-number:U72900MH2026PTC123456}")
    private String cinNumber;

    @Value("${app.about.support-email:support@stockfolio.app}")
    private String supportEmail;

    @Value("${app.about.support-phone:+91-22-4000-2026}")
    private String supportPhone;

    @Value("${app.about.website:https://stockfolio.app}")
    private String website;

    @Value("${app.about.registered-office:3rd Floor, Fintech Tower, Bengaluru, Karnataka, India}")
    private String registeredOffice;

    public AboutInfo getAboutInfo() {
        AboutInfo info = new AboutInfo();
        info.setCompanyName(companyName);
        info.setCompanyId(companyId);
        info.setGstNumber(gstNumber);
        info.setPanNumber(panNumber);
        info.setCinNumber(cinNumber);
        info.setSupportEmail(supportEmail);
        info.setSupportPhone(supportPhone);
        info.setWebsite(website);
        info.setRegisteredOffice(registeredOffice);
        return info;
    }
}
