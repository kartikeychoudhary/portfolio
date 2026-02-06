package com.portfolio;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(locations = "classpath:application.properties")
class PortfolioApplicationTests {

    @Test
    void contextLoads() {
        // Test that the Spring application context loads successfully
    }
}
