---
title: "Synchronous Apex"
description: "Understanding synchronous Apex execution and best practices"
date: 2024-01-01
tags: ["apex", "synchronous", "triggers", "classes"]
---

# Synchronous Apex

Synchronous Apex refers to code that executes immediately and waits for the operation to complete before moving to the next line of code.

## Common Use Cases

### 1. Triggers

Triggers execute synchronously when a DML operation occurs:

```apex
trigger AccountTrigger on Account (before insert, after update) {
    if (Trigger.isBefore && Trigger.isInsert) {
        for (Account acc : Trigger.new) {
            // Validate account data
            if (String.isBlank(acc.Name)) {
                acc.addError('Account Name is required');
            }
        }
    }
}
```

### 2. Apex Classes

Standard Apex class methods execute synchronously:

```apex
public class AccountService {
    public static void updateAccountRating(List<Account> accounts) {
        for (Account acc : accounts) {
            if (acc.AnnualRevenue > 1000000) {
                acc.Rating = 'Hot';
            } else if (acc.AnnualRevenue > 500000) {
                acc.Rating = 'Warm';
            } else {
                acc.Rating = 'Cold';
            }
        }
        update accounts;
    }
}
```

## Governor Limits

Synchronous Apex has specific governor limits:

| Limit | Value |
|-------|-------|
| SOQL queries | 100 |
| DML statements | 150 |
| CPU time | 10,000 ms |
| Heap size | 6 MB |

## Best Practices

### 1. Bulkify Your Code

Always write code that handles multiple records:

```apex
// Bad - Not bulkified
for (Account acc : accounts) {
    Contact con = [SELECT Id FROM Contact WHERE AccountId = :acc.Id];
    // Process contact
}

// Good - Bulkified
Set<Id> accountIds = new Set<Id>();
for (Account acc : accounts) {
    accountIds.add(acc.Id);
}
Map<Id, Contact> contactMap = new Map<Id, Contact>(
    [SELECT Id, AccountId FROM Contact WHERE AccountId IN :accountIds]
);
```

### 2. Avoid SOQL in Loops

```apex
// Bad
for (Account acc : accounts) {
    List<Contact> contacts = [SELECT Id FROM Contact WHERE AccountId = :acc.Id];
}

// Good
Map<Id, List<Contact>> accountContactMap = new Map<Id, List<Contact>>();
for (Contact con : [SELECT Id, AccountId FROM Contact WHERE AccountId IN :accountIds]) {
    if (!accountContactMap.containsKey(con.AccountId)) {
        accountContactMap.put(con.AccountId, new List<Contact>());
    }
    accountContactMap.get(con.AccountId).add(con);
}
```

### 3. Use Collections Efficiently

```apex
// Use Sets for unique values
Set<Id> uniqueIds = new Set<Id>();

// Use Maps for quick lookups
Map<Id, Account> accountMap = new Map<Id, Account>([SELECT Id, Name FROM Account]);

// Use Lists for ordered collections
List<Account> orderedAccounts = new List<Account>();
```

## Common Patterns

### Trigger Framework

```apex
public class TriggerHandler {
    public void run() {
        if (Trigger.isBefore) {
            if (Trigger.isInsert) {
                beforeInsert();
            } else if (Trigger.isUpdate) {
                beforeUpdate();
            }
        }
        // Additional logic
    }

    protected virtual void beforeInsert() {}
    protected virtual void beforeUpdate() {}
}
```

## Error Handling

```apex
public class AccountProcessor {
    public static void processAccounts(List<Account> accounts) {
        try {
            // Business logic
            update accounts;
        } catch (DmlException e) {
            // Log error
            System.debug('Error: ' + e.getMessage());
            // Handle error appropriately
            throw new CustomException('Failed to process accounts: ' + e.getMessage());
        }
    }
}
```

## Performance Considerations

1. **Minimize Database Operations**: Combine multiple DML operations when possible
2. **Use Selective SOQL**: Always use WHERE clauses with indexed fields
3. **Lazy Loading**: Only query data when needed
4. **Cache Results**: Store frequently accessed data in static variables

## Testing Synchronous Apex

```apex
@isTest
private class AccountServiceTest {
    @isTest
    static void testUpdateAccountRating() {
        // Create test data
        List<Account> accounts = new List<Account>();
        for (Integer i = 0; i < 200; i++) {
            accounts.add(new Account(
                Name = 'Test Account ' + i,
                AnnualRevenue = 1000000 * i
            ));
        }
        insert accounts;

        // Test the method
        Test.startTest();
        AccountService.updateAccountRating(accounts);
        Test.stopTest();

        // Verify results
        List<Account> updatedAccounts = [SELECT Id, Rating FROM Account];
        System.assertEquals(200, updatedAccounts.size());
        // Additional assertions
    }
}
```
