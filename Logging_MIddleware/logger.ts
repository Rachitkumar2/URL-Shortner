export interface LogEntry {
  timestamp: string;
  stack: string;
  level: 'info' | 'warn' | 'error' | 'debug' | 'fatal';
  package: string;
  message: string;
  context?: any;
}

/**
 * Logging Middleware - A reusable package for robust and observable applications
 * Captures the entire lifecycle of significant events within your application
 * Provides strategic logging throughout the codebase with API integration
 */
class LoggingMiddleware {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Prevent memory overflow
  private testServerEndpoint = 'http://localhost:3001/api/logs'; // Test server endpoint

  /**
   * Main Log function that matches the required structure:
   * Log(stack, level, package, message)
   * 
   * @param stack - Stack trace or calling context
   * @param level - Log level (info, warn, error, debug, fatal)
   * @param packageName - Package/module name where log originates
   * @param message - Descriptive log message
   */
  public Log(stack: string, level: 'info' | 'warn' | 'error' | 'debug' | 'fatal', packageName: string, message: string, context?: any): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      stack,
      level,
      package: packageName,
      message,
      context
    };

    this.addLog(logEntry);
    this.sendToTestServer(logEntry);
  }

  /**
   * Convenience methods for different log levels
   */
  public info(stack: string, packageName: string, message: string, context?: any): void {
    this.Log(stack, 'info', packageName, message, context);
  }

  public warn(stack: string, packageName: string, message: string, context?: any): void {
    this.Log(stack, 'warn', packageName, message, context);
  }

  public error(stack: string, packageName: string, message: string, context?: any): void {
    this.Log(stack, 'error', packageName, message, context);
  }

  public debug(stack: string, packageName: string, message: string, context?: any): void {
    this.Log(stack, 'debug', packageName, message, context);
  }

  public fatal(stack: string, packageName: string, message: string, context?: any): void {
    this.Log(stack, 'fatal', packageName, message, context);
  }

  /**
   * Handles backend and frontend errors as specified in requirements
   */
  public logBackendError(handler: string, expectedType: string, receivedValue: any): void {
    const stack = this.getStackTrace();
    const message = `received ${typeof receivedValue}, expected ${expectedType}`;
    this.Log(stack, 'error', 'backend', `${handler}: ${message}`, { expectedType, receivedValue });
  }

  public logDatabaseError(operation: string, error: any): void {
    const stack = this.getStackTrace();
    const message = `Critical database connection failure.`;
    this.Log(stack, 'fatal', 'db', message, { operation, error });
  }

  /**
   * Internal method to add log to memory storage
   */
  private addLog(logEntry: LogEntry): void {
    this.logs.push(logEntry);

    // Keep only the latest logs to prevent memory overflow
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Store in sessionStorage for debugging (browser only)
    this.storeInSession(logEntry);
  }

  /**
   * Sends log to Test Server via API call
   */
  private async sendToTestServer(logEntry: LogEntry): Promise<void> {
    try {
      // Only attempt API call in browser environment
      if (typeof window !== 'undefined') {
        const response = await fetch(this.testServerEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(logEntry),
        });

        if (!response.ok) {
          // Log API failure to sessionStorage only (avoid recursion)
          this.storeInSession({
            timestamp: new Date().toISOString(),
            stack: this.getStackTrace(),
            level: 'warn',
            package: 'LoggingMiddleware',
            message: `Failed to send log to test server: ${response.status}`,
            context: { originalLog: logEntry }
          });
        }
      }
    } catch (error) {
      // Silently handle API errors to prevent application disruption
      this.storeInSession({
        timestamp: new Date().toISOString(),
        stack: this.getStackTrace(),
        level: 'warn',
        package: 'LoggingMiddleware',
        message: 'Test server unavailable',
        context: { error, originalLog: logEntry }
      });
    }
  }

  /**
   * Store logs in sessionStorage for debugging
   */
  private storeInSession(logEntry: LogEntry): void {
    if (typeof window !== 'undefined') {
      try {
        const existingLogs = sessionStorage.getItem('logging-middleware-logs');
        const logs = existingLogs ? JSON.parse(existingLogs) : [];
        logs.push(logEntry);
        
        // Keep only latest 100 logs in sessionStorage
        if (logs.length > 100) {
          logs.splice(0, logs.length - 100);
        }
        
        sessionStorage.setItem('logging-middleware-logs', JSON.stringify(logs));
      } catch (error) {
        // Silently handle storage errors
      }
    }
  }

  /**
   * Get current stack trace
   */
  private getStackTrace(): string {
    try {
      throw new Error();
    } catch (error) {
      const stack = (error as Error).stack;
      if (stack) {
        // Clean up stack trace and return relevant parts
        const lines = stack.split('\n');
        // Skip the first 3 lines (Error, getStackTrace, and calling method)
        return lines.slice(3, 6).join('\n');
      }
      return 'Stack trace unavailable';
    }
  }

  /**
   * Retrieve all logs
   */
  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Clear all logs
   */
  public clearLogs(): void {
    this.logs = [];
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('logging-middleware-logs');
    }
  }

  /**
   * Set custom test server endpoint
   */
  public setTestServerEndpoint(endpoint: string): void {
    this.testServerEndpoint = endpoint;
  }
}

// Export singleton instance for reusable package
export const logger = new LoggingMiddleware();

// Export class for advanced usage
export { LoggingMiddleware };
