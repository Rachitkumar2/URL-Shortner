# Logging Middleware - Reusable Package

A critical component for building robust and observable applications. This logging middleware captures the entire lifecycle of significant events within your application – from successful operations to warnings, informational messages, and debugging details.

## Overview

The Logging Middleware is designed as a reusable package that can be integrated strategically throughout your codebase. Each log call provides specific and descriptive context about what's happening, making logs the narrative of your application's execution.

## Key Features

- **Reusable Package**: Designed for integration across multiple projects
- **TypeScript/JavaScript Support**: Full TypeScript implementation with JavaScript compatibility
- **API Integration**: Makes API calls to Test Server for log persistence
- **Strategic Logging**: Captures significant application events and state changes
- **Error Handling**: Robust error logging for both backend and frontend operations
- **Memory Management**: Automatic log rotation to prevent memory overflow
- **Debug Support**: SessionStorage integration for development debugging

## Core Function Structure

The middleware follows the required API structure:

```typescript
Log(stack, level, package, message)
```

### Parameters
- **stack**: Stack trace or calling context information
- **level**: Log level ('info', 'warn', 'error', 'debug', 'fatal')
- **package**: Package/module name where the log originates
- **message**: Descriptive message about what's happening

## Installation & Usage

### Basic Integration

```typescript
import { logger } from './logger';

// Using the main Log function
logger.Log('UserService.createUser', 'info', 'backend', 'User account created successfully');

// Using convenience methods
logger.info('UserService.createUser', 'backend', 'User registration process started');
logger.warn('ValidationService.validateEmail', 'frontend', 'Email format validation failed');
logger.error('DatabaseService.connect', 'backend', 'Database connection timeout');
logger.debug('ComponentRenderer.render', 'frontend', 'Component props updated');
logger.fatal('PaymentService.processPayment', 'backend', 'Critical payment processing failure');
```

### Error Handling Examples

As specified in the requirements, the middleware provides specialized error handling:

```typescript
// Backend error handling
logger.logBackendError('handler', 'received string, expected bool', actualValue);

// Database error handling  
logger.logDatabaseError('connection', 'Critical database connection failure.');
```

### Advanced Usage with Context

```typescript
// Include additional context for better debugging
logger.Log(
  'OrderService.processOrder', 
  'info', 
  'backend', 
  'Order processed successfully',
  { orderId: '12345', userId: 'user789', amount: 99.99 }
);

// Error with detailed context
logger.error(
  'PaymentGateway.chargeCard',
  'backend', 
  'Payment processing failed',
  { 
    errorCode: 'CARD_DECLINED', 
    cardLast4: '1234',
    amount: 150.00,
    timestamp: new Date().toISOString()
  }
);
```

## Strategic Implementation

### Throughout Your Codebase

The middleware should be integrated strategically to capture:

1. **User Actions**: Login, registration, data modifications
2. **System Operations**: Database queries, API calls, file operations
3. **Business Logic**: Payment processing, order fulfillment, calculations
4. **Error Conditions**: Validation failures, network errors, system exceptions
5. **Performance Metrics**: Slow operations, resource usage, bottlenecks

### Examples of Strategic Logging

```typescript
// User authentication flow
logger.info('AuthService.login', 'backend', 'User login attempt initiated', { email: userEmail });
logger.warn('AuthService.login', 'backend', 'Invalid password attempt', { email: userEmail, attempts: 3 });
logger.error('AuthService.login', 'backend', 'Account locked due to multiple failed attempts', { email: userEmail });

// Database operations
logger.debug('UserRepository.findById', 'backend', 'Database query executed', { userId, queryTime: '45ms' });
logger.fatal('DatabaseConnection.init', 'backend', 'Critical database connection failure', { host, port, error });

// Frontend user interactions
logger.info('URLShortener.createShortUrl', 'frontend', 'URL shortening request initiated', { originalUrl });
logger.warn('URLValidator.validate', 'frontend', 'Invalid URL format detected', { url, validationErrors });
```

## API Integration

### Test Server Communication

The middleware automatically sends logs to a configurable Test Server endpoint:

```typescript
// Default endpoint: http://localhost:3001/api/logs
// Configure custom endpoint:
logger.setTestServerEndpoint('https://your-test-server.com/api/logs');
```

### Log Payload Structure

Each API call sends a structured log entry:

```json
{
  "timestamp": "2025-09-09T06:15:30.123Z",
  "stack": "UserService.createUser\n  at UserController.register\n  at Router.handle",
  "level": "info",
  "package": "backend",
  "message": "User account created successfully",
  "context": {
    "userId": "user_12345",
    "email": "user@example.com"
  }
}
```

## Configuration Options

### Custom Endpoints

```typescript
// Set custom test server endpoint
logger.setTestServerEndpoint('http://localhost:8080/logs');
```

### Memory Management

```typescript
// View current logs
const allLogs = logger.getLogs();

// Clear log history
logger.clearLogs();
```

## Development & Debugging

### SessionStorage Integration

For development and debugging, logs are automatically stored in browser sessionStorage:

```javascript
// Access logs in browser console
const logs = JSON.parse(sessionStorage.getItem('logging-middleware-logs'));
console.table(logs);
```

### Error Resilience

The middleware is designed to never disrupt your application:

- API failures are handled silently
- Network errors don't propagate
- Storage issues are gracefully managed
- Memory overflow is automatically prevented

## Implementation Examples

### URL Shortener Integration

```typescript
// URL shortening service
class URLService {
  shortenUrl(originalUrl: string): string {
    const stack = 'URLService.shortenUrl';
    
    logger.info(stack, 'frontend', 'URL shortening request initiated', { originalUrl });
    
    try {
      // Validation
      if (!this.isValidUrl(originalUrl)) {
        logger.warn(stack, 'frontend', 'Invalid URL format provided', { originalUrl });
        throw new Error('Invalid URL format');
      }
      
      // Generate short code
      const shortCode = this.generateShortCode();
      logger.debug(stack, 'frontend', 'Short code generated', { shortCode, originalUrl });
      
      // Save to storage
      this.saveToStorage(shortCode, originalUrl);
      logger.info(stack, 'frontend', 'URL shortened successfully', { shortCode, originalUrl });
      
      return shortCode;
      
    } catch (error) {
      logger.error(stack, 'frontend', 'URL shortening failed', { originalUrl, error: error.message });
      throw error;
    }
  }
}
```

### Click Tracking Integration

```typescript
// Click tracking with detailed analytics
class AnalyticsService {
  recordClick(shortCode: string): void {
    const stack = 'AnalyticsService.recordClick';
    
    logger.info(stack, 'frontend', 'Click tracking initiated', { shortCode });
    
    const clickData = {
      shortCode,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      location: this.getCoarseLocation()
    };
    
    logger.debug(stack, 'frontend', 'Click data collected', clickData);
    
    try {
      this.saveClickRecord(clickData);
      logger.info(stack, 'frontend', 'Click recorded successfully', { shortCode });
    } catch (error) {
      logger.error(stack, 'frontend', 'Failed to record click', { shortCode, error: error.message });
    }
  }
}
```

## Best Practices

### 1. **Meaningful Messages**
Write log messages that clearly communicate the state, actions, and relevant data at that point in the code.

### 2. **Appropriate Log Levels**
- **info**: Successful operations, user actions, system events
- **warn**: Recoverable errors, validation failures, deprecated usage
- **error**: Failed operations, exceptions, recoverable system errors  
- **debug**: Development information, performance metrics, detailed flow
- **fatal**: Critical system failures, unrecoverable errors

### 3. **Context Inclusion**
Always include relevant context data that would be valuable for troubleshooting months from now.

### 4. **Strategic Placement**
Focus on logging significant events rather than every function call. Think about what information would be most valuable for understanding application behavior and troubleshooting issues.

## Technical Specifications

- **Language**: TypeScript with JavaScript compatibility
- **Dependencies**: None (pure implementation)
- **Browser Support**: Modern browsers with fetch API support
- **Node.js Support**: Compatible with Node.js environments
- **Memory Usage**: Optimized with automatic log rotation
- **API Protocol**: HTTP POST with JSON payload
- **Storage**: SessionStorage for browser debugging

## Package Structure

```
Logging_MIddleware/
├── logger.ts          # Main logging middleware implementation
├── README.md          # This documentation
└── package.json       # Package configuration (optional)
```

---

**Built for robust, observable applications with comprehensive lifecycle logging.**
