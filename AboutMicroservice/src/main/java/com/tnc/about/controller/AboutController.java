package com.tnc.about.controller;

import com.tnc.about.service.AboutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "http://localhost:4200")
public class AboutController {

    @Autowired
    private AboutService aboutService;

    @GetMapping("about")
    public ResponseEntity<?> getAbout() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "About information retrieved");
        response.put("data", aboutService.getAboutInfo());
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping("health")
    public ResponseEntity<?> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ok");
        return ResponseEntity.ok(response);
    }
}
