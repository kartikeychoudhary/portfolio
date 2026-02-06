#!/bin/bash

# Spring Boot Backend Test Runner
# Run this script to execute all tests with detailed output

echo "======================================"
echo "  Spring Boot Backend Test Runner"
echo "======================================"
echo ""

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed or not in PATH"
    echo ""
    echo "Please install Maven:"
    echo "  - macOS: brew install maven"
    echo "  - Ubuntu/Debian: sudo apt-get install maven"
    echo "  - Windows: Download from https://maven.apache.org/download.cgi"
    exit 1
fi

echo "✓ Maven found: $(mvn --version | head -1)"
echo ""

# Check if pom.xml exists
if [ ! -f "pom.xml" ]; then
    echo "❌ pom.xml not found. Please run this script from the backend directory."
    exit 1
fi

echo "======================================"
echo "  Running Tests..."
echo "======================================"
echo ""

# Run tests with detailed output
mvn clean test

TEST_RESULT=$?

echo ""
echo "======================================"

if [ $TEST_RESULT -eq 0 ]; then
    echo "  ✓ ALL TESTS PASSED!"
else
    echo "  ❌ TESTS FAILED"
    echo ""
    echo "Check the output above for details."
fi

echo "======================================"
echo ""

# Show test summary
echo "Test Summary:"
mvn surefire-report:report-only 2>/dev/null
echo ""

echo "To see detailed test results:"
echo "  - Open: target/surefire-reports/index.html"
echo "  - Or check: target/surefire-reports/*.txt"
echo ""

exit $TEST_RESULT
