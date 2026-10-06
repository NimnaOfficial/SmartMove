package com.nibm.smartmove.serviceregistry;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;\nimport org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication\n@EnableEurekaServer
public class ServiceRegistryApplication {
    public static void main(String[] args) {
        SpringApplication.run(ServiceRegistryApplication.class, args);
    }
}
