const fs = require('fs');
const path = require('path');

const basePath = path.join('C:', 'Users', 'SANDANIMNE', 'Desktop', 'code ss', 'SmartMove', 'SmartMove', 'services');

const services = [
  { name: 'service-registry', port: 8761, type: 'eureka' },
  { name: 'api-gateway', port: 8080, type: 'gateway' },
  { name: 'auth-service', port: 8081, type: 'oracle-auth' },
  { name: 'vehicle-service', port: 8082, type: 'oracle' },
  { name: 'driver-service', port: 8083, type: 'oracle' },
  { name: 'route-service', port: 8084, type: 'oracle' },
  { name: 'passenger-service', port: 8085, type: 'oracle' },
  { name: 'trip-service', port: 8086, type: 'oracle' },
  { name: 'booking-service', port: 8087, type: 'oracle' },
  { name: 'payment-service', port: 8088, type: 'oracle' },
  { name: 'maintenance-service', port: 8089, type: 'oracle' },
  { name: 'feedback-service', port: 8090, type: 'oracle' },
  { name: 'content-service', port: 8091, type: 'mongo' },
  { name: 'report-service', port: 8092, type: 'oracle' },
];

function getPomTemplate(serviceName, type) {
  let dependencies = '';
  if (type === 'eureka') {
    dependencies = `
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
        </dependency>`;
  } else if (type === 'gateway') {
    dependencies = `
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-gateway</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>`;
  } else if (type === 'oracle' || type === 'oracle-auth') {
    dependencies = `
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>com.oracle.database.jdbc</groupId>
            <artifactId>ojdbc11</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>`;
        
    if (type === 'oracle-auth') {
        dependencies += `
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.11.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>`;
    }
  } else if (type === 'mongo') {
    dependencies = `
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-mongodb</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>`;
  }

  let buildPlugins = `
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>`;
            
  if (type === 'oracle' || type === 'oracle-auth' || type === 'mongo') {
      buildPlugins = `
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>4.1.1</version>
        <relativePath/>
    </parent>
    <groupId>com.nibm.smartmove</groupId>
    <artifactId>${serviceName}</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>${serviceName}</name>
    <properties>
        <java.version>17</java.version>
        <spring-cloud.version>2025.0.0</spring-cloud.version>
    </properties>
    <dependencies>
${dependencies}
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>\${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
    <build>
        <plugins>
${buildPlugins}
        </plugins>
    </build>
</project>`;
}

function getYmlTemplate(serviceName, port, type) {
  if (type === 'eureka') {
    return `server:
  port: ${port}

spring:
  application:
    name: ${serviceName}

eureka:
  client:
    register-with-eureka: false
    fetch-registry: false
  server:
    enable-self-preservation: false
`;
  } else if (type === 'gateway') {
    return `server:
  port: ${port}

spring:
  application:
    name: ${serviceName}
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: lb://auth-service
          predicates:
            - Path=/api/auth/**
        - id: vehicle-service
          uri: lb://vehicle-service
          predicates:
            - Path=/api/vehicles/**
        - id: driver-service
          uri: lb://driver-service
          predicates:
            - Path=/api/drivers/**
        - id: route-service
          uri: lb://route-service
          predicates:
            - Path=/api/routes/**
        - id: passenger-service
          uri: lb://passenger-service
          predicates:
            - Path=/api/passengers/**
        - id: trip-service
          uri: lb://trip-service
          predicates:
            - Path=/api/trips/**
        - id: booking-service
          uri: lb://booking-service
          predicates:
            - Path=/api/bookings/**
        - id: payment-service
          uri: lb://payment-service
          predicates:
            - Path=/api/payments/**
        - id: maintenance-service
          uri: lb://maintenance-service
          predicates:
            - Path=/api/maintenance/**
        - id: feedback-service
          uri: lb://feedback-service
          predicates:
            - Path=/api/feedback/**
        - id: content-service
          uri: lb://content-service
          predicates:
            - Path=/api/reviews/**,/api/announcements/**,/api/documents/**,/api/media/**
        - id: report-service
          uri: lb://report-service
          predicates:
            - Path=/api/reports/**
      default-filters:
        - DedupeResponseHeader=Access-Control-Allow-Credentials Access-Control-Allow-Origin
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins: "http://localhost:3000"
            allowedMethods: "*"
            allowedHeaders: "*"
            allowCredentials: true

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
`;
  } else if (type === 'oracle' || type === 'oracle-auth') {
    return `server:
  port: ${port}

spring:
  application:
    name: ${serviceName}
  datasource:
    url: jdbc:oracle:thin:@localhost:1521/XEPDB1
    username: smartmove
    password: smartmove123
    driver-class-name: oracle.jdbc.OracleDriver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.OracleDialect
        format_sql: true

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true

management:
  endpoints:
    web:
      exposure:
        include: health,info
`;
  } else if (type === 'mongo') {
    return `server:
  port: ${port}

spring:
  application:
    name: ${serviceName}
  data:
    mongodb:
      uri: mongodb://localhost:27017/smartmove
      database: smartmove

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true

management:
  endpoints:
    web:
      exposure:
        include: health,info
`;
  }
}

function getDevYmlTemplate(type) {
  if (type === 'oracle' || type === 'oracle-auth') {
    return `spring:
  datasource:
    url: jdbc:oracle:thin:@localhost:1521/XEPDB1
    username: smartmove
    password: smartmove123
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
`;
  } else if (type === 'mongo') {
    return `spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/smartmove
`;
  }
  return '';
}

function getTestYmlTemplate(type) {
  if (type === 'oracle' || type === 'oracle-auth') {
    return `spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password:
  jpa:
    hibernate:
      ddl-auto: create-drop
    database-platform: org.hibernate.dialect.H2Dialect
`;
  }
  return '';
}

function getJavaMainClass(serviceName, type) {
  const packageName = serviceName.replace('-', '');
  const className = serviceName.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('') + 'Application';
  
  let annotations = '@SpringBootApplication';
  let imports = `import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;`;

  if (type === 'eureka') {
    annotations += '\\n@EnableEurekaServer';
    imports += '\\nimport org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;';
  }

  return `package com.nibm.smartmove.${packageName};

${imports}

${annotations}
public class ${className} {
    public static void main(String[] args) {
        SpringApplication.run(${className}.class, args);
    }
}
`;
}

services.forEach(svc => {
  const svcPath = path.join(basePath, svc.name);
  
  // Ensure directories exist
  const resourcesPath = path.join(svcPath, 'src', 'main', 'resources');
  const testResourcesPath = path.join(svcPath, 'src', 'test', 'resources');
  
  const packageName = svc.name.replace('-', '');
  const javaMainPath = path.join(svcPath, 'src', 'main', 'java', 'com', 'nibm', 'smartmove', packageName);
  
  fs.mkdirSync(resourcesPath, { recursive: true });
  fs.mkdirSync(testResourcesPath, { recursive: true });
  fs.mkdirSync(javaMainPath, { recursive: true });

  // POM
  fs.writeFileSync(path.join(svcPath, 'pom.xml'), getPomTemplate(svc.name, svc.type));
  
  // YAMLs
  fs.writeFileSync(path.join(resourcesPath, 'application.yml'), getYmlTemplate(svc.name, svc.port, svc.type));
  
  const devYml = getDevYmlTemplate(svc.type);
  if (devYml) fs.writeFileSync(path.join(resourcesPath, 'application-dev.yml'), devYml);
  
  const testYml = getTestYmlTemplate(svc.type);
  if (testYml) fs.writeFileSync(path.join(testResourcesPath, 'application-test.yml'), testYml);
  
  // Main Application Class
  const className = svc.name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('') + 'Application.java';
  fs.writeFileSync(path.join(javaMainPath, className), getJavaMainClass(svc.name, svc.type));

  // Package structure (controllers, etc.)
  if (svc.type === 'oracle' || svc.type === 'oracle-auth' || svc.type === 'mongo') {
      const subPackages = ['controller', 'service', 'repository', 'dto'];
      if (svc.type === 'oracle') subPackages.push('entity', 'exception');
      if (svc.type === 'oracle-auth') subPackages.push('entity', 'security', 'config');
      if (svc.type === 'mongo') subPackages.push('model');
      
      subPackages.forEach(sub => {
          const subPath = path.join(javaMainPath, sub);
          fs.mkdirSync(subPath, { recursive: true });
          fs.writeFileSync(path.join(subPath, '.gitkeep'), '');
      });
  }
});

console.log('Backend microservices setup complete.');
