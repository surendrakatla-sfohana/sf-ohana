---
title: "Asynchronous Apex"
description: "Master asynchronous processing in Salesforce with Future methods, Batch Apex, Queueable, and Scheduled Apex"
date: 2024-01-02
tags: ["apex", "asynchronous", "batch", "queueable", "future"]
---

# Asynchronous Apex

Asynchronous Apex allows you to run processes in the background, enabling more flexible and efficient processing of large data volumes.

## Types of Asynchronous Apex

### 1. Future Methods

Future methods run in the background and are useful for callouts and operations that don't require immediate processing.

```apex
public class AccountProcessor {
    @future
    public static void updateAccountsAsync(Set<Id> accountIds) {
        List<Account> accounts = [SELECT Id, Name FROM Account WHERE Id IN :accountIds];
        // Process accounts
        update accounts;
    }

    @future(callout=true)
    public static void makeCallout(String endpoint) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(endpoint);
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        // Process response
    }
}
```

### 2. Batch Apex

Batch Apex is ideal for processing large data sets that would exceed normal processing limits.

```apex
public class AccountBatch implements Database.Batchable<sObject>, Database.Stateful {
    private Integer recordsProcessed = 0;

    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator([
            SELECT Id, Name, AnnualRevenue
            FROM Account
            WHERE CreatedDate = LAST_N_DAYS:30
        ]);
    }

    public void execute(Database.BatchableContext bc, List<Account> scope) {
        for (Account acc : scope) {
            // Process each account
            acc.Description = 'Processed on ' + Date.today();
            recordsProcessed++;
        }
        update scope;
    }

    public void finish(Database.BatchableContext bc) {
        System.debug('Batch completed. Records processed: ' + recordsProcessed);
        // Send email notification
        AsyncApexJob job = [SELECT Id, Status, CompletedDate FROM AsyncApexJob WHERE Id = :bc.getJobId()];
        // Email logic
    }
}

// Execute batch
AccountBatch batch = new AccountBatch();
Database.executeBatch(batch, 200);
```

### 3. Queueable Apex

Queueable Apex provides more flexibility than future methods with the ability to chain jobs.

```apex
public class AccountQueueable implements Queueable {
    private List<Account> accounts;

    public AccountQueueable(List<Account> accounts) {
        this.accounts = accounts;
    }

    public void execute(QueueableContext context) {
        // Process accounts
        for (Account acc : accounts) {
            acc.Description = 'Processed by Queueable';
        }
        update accounts;

        // Chain another job if needed
        if (!Test.isRunningTest()) {
            System.enqueueJob(new ContactQueueable());
        }
    }
}

// Enqueue the job
System.enqueueJob(new AccountQueueable(accountList));
```

### 4. Scheduled Apex

Scheduled Apex allows you to schedule code execution at specific times.

```apex
public class AccountScheduler implements Schedulable {
    public void execute(SchedulableContext sc) {
        // Execute batch or other logic
        Database.executeBatch(new AccountBatch(), 200);
    }
}

// Schedule the job
String cronExp = '0 0 12 * * ?'; // Daily at noon
System.schedule('Daily Account Processing', cronExp, new AccountScheduler());
```

## Comparison Table

| Feature | Future | Batch | Queueable | Scheduled |
|---------|--------|-------|-----------|-----------|
| Governor Limits | Higher | Highest | Higher | Normal |
| Can call from Trigger | Yes | No | Yes | No |
| Supports Callouts | Yes | Yes | Yes | Yes |
| Can chain jobs | No | Yes | Yes | Yes |
| Can use non-primitive types | No | Yes | Yes | Yes |
| Can track job progress | No | Yes | Yes | Yes |

## Best Practices

### 1. Choose the Right Tool

- **Future Methods**: Simple fire-and-forget operations
- **Batch Apex**: Large data volume processing
- **Queueable**: Complex logic with chaining needs
- **Scheduled**: Time-based execution requirements

### 2. Error Handling

```apex
public class RobustBatch implements Database.Batchable<sObject>, Database.RaisesPlatformEvents {
    public void execute(Database.BatchableContext bc, List<Account> scope) {
        List<Database.SaveResult> results = Database.update(scope, false);

        for (Integer i = 0; i < results.size(); i++) {
            if (!results[i].isSuccess()) {
                // Log errors
                for (Database.Error err : results[i].getErrors()) {
                    System.debug('Error: ' + err.getMessage());
                }
            }
        }
    }
}
```

### 3. Testing Asynchronous Apex

```apex
@isTest
private class AsynchronousApexTest {
    @isTest
    static void testFutureMethod() {
        // Create test data
        Set<Id> accountIds = new Set<Id>();
        // Add account IDs

        Test.startTest();
        AccountProcessor.updateAccountsAsync(accountIds);
        Test.stopTest();

        // Assertions - code runs synchronously in test context
        // Verify results
    }

    @isTest
    static void testBatchApex() {
        // Create test data
        List<Account> accounts = TestDataFactory.createAccounts(200);

        Test.startTest();
        Database.executeBatch(new AccountBatch(), 200);
        Test.stopTest();

        // Verify batch results
    }
}
```

## Governor Limits Comparison

| Limit Type | Synchronous | Future | Batch (per batch) | Queueable |
|------------|-------------|---------|-------------------|-----------|
| SOQL queries | 100 | 200 | 200 | 200 |
| DML rows | 10,000 | 10,000 | 10,000 | 10,000 |
| Heap size | 6 MB | 12 MB | 12 MB | 12 MB |
| CPU time | 10,000 ms | 60,000 ms | 60,000 ms | 60,000 ms |

## Common Patterns

### Retry Logic

```apex
public class RetryableQueueable implements Queueable {
    private Integer retryCount;
    private static final Integer MAX_RETRIES = 3;

    public RetryableQueueable(Integer retryCount) {
        this.retryCount = retryCount;
    }

    public void execute(QueueableContext context) {
        try {
            // Main logic
        } catch (Exception e) {
            if (retryCount < MAX_RETRIES) {
                System.enqueueJob(new RetryableQueueable(retryCount + 1));
            } else {
                // Log final failure
            }
        }
    }
}
```

### Chaining Pattern

```apex
public class ChainedQueueable implements Queueable, Database.AllowsCallouts {
    private String stage;

    public ChainedQueueable(String stage) {
        this.stage = stage;
    }

    public void execute(QueueableContext context) {
        switch on stage {
            when 'STAGE_1' {
                // Process stage 1
                System.enqueueJob(new ChainedQueueable('STAGE_2'));
            }
            when 'STAGE_2' {
                // Process stage 2
                System.enqueueJob(new ChainedQueueable('STAGE_3'));
            }
            when 'STAGE_3' {
                // Final processing
            }
        }
    }
}
```
