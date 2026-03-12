---
title: "LWC Basics"
description: "Fundamental concepts and structure of Lightning Web Components"
date: 2024-01-03
tags: ["lwc", "javascript", "html", "css"]
---

# LWC Basics

## Component Structure

Every LWC consists of three main files:

### 1. JavaScript File (`.js`)

Controls the component's behavior and logic:

```javascript
// myComponent.js
import { LightningElement, api, track } from 'lwc';

export default class MyComponent extends LightningElement {
    @api recordId;
    @track isLoading = false;

    greeting = 'Hello World';

    handleClick() {
        this.isLoading = true;
        // Component logic
    }
}
```

### 2. HTML Template (`.html`)

Defines the component's markup:

```html
<!-- myComponent.html -->
<template>
    <lightning-card title={greeting}>
        <div class="slds-m-around_medium">
            <lightning-button
                label="Click Me"
                onclick={handleClick}
                disabled={isLoading}>
            </lightning-button>

            <template if:true={isLoading}>
                <lightning-spinner></lightning-spinner>
            </template>
        </div>
    </lightning-card>
</template>
```

### 3. CSS File (`.css`)

Styles the component (scoped by default):

```css
/* myComponent.css */
:host {
    display: block;
    padding: 1rem;
}

.custom-style {
    color: #0176D3;
    font-weight: bold;
}
```

### 4. Configuration File (`.js-meta.xml`)

Configures where the component can be used:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>59.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__RecordPage</target>
        <target>lightning__AppPage</target>
        <target>lightning__HomePage</target>
    </targets>
    <targetConfigs>
        <targetConfig targets="lightning__RecordPage">
            <objects>
                <object>Account</object>
                <object>Contact</object>
            </objects>
        </targetConfig>
    </targetConfigs>
</LightningComponentBundle>
```

## Decorators

### @api - Public Properties

Makes a property or method public:

```javascript
import { LightningElement, api } from 'lwc';

export default class PublicProperty extends LightningElement {
    @api recordId;
    @api objectApiName;

    @api
    refresh() {
        // Public method that parent components can call
    }
}
```

### @track - Reactive Properties

Makes object and array properties reactive (not needed for primitives):

```javascript
import { LightningElement, track } from 'lwc';

export default class TrackedProperty extends LightningElement {
    @track address = {
        street: '',
        city: '',
        country: ''
    };

    updateStreet(event) {
        this.address.street = event.target.value;
        // Without @track, the UI wouldn't update
    }
}
```

### @wire - Wire Adapters

Connects to Salesforce data and services:

```javascript
import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';

export default class WireExample extends LightningElement {
    @api recordId;

    @wire(getRecord, {
        recordId: '$recordId',
        fields: [ACCOUNT_NAME_FIELD]
    })
    account;

    get accountName() {
        return this.account.data?.fields?.Name?.value;
    }
}
```

## Template Directives

### Conditional Rendering

```html
<template>
    <!-- if:true -->
    <template if:true={showDetails}>
        <div>Details are visible</div>
    </template>

    <!-- if:false -->
    <template if:false={isLoading}>
        <div>Not loading</div>
    </template>

    <!-- lwc:if (newer syntax) -->
    <div lwc:if={showContent}>
        Conditional content
    </div>
    <div lwc:elseif={showAlternative}>
        Alternative content
    </div>
    <div lwc:else>
        Default content
    </div>
</template>
```

### Iteration

```html
<template>
    <!-- for:each -->
    <ul>
        <template for:each={accounts} for:item="account">
            <li key={account.Id}>
                {account.Name}
            </li>
        </template>
    </ul>

    <!-- iterator -->
    <template iterator:it={contacts}>
        <div key={it.value.Id}>
            <template if:true={it.first}>
                <div>Start of list</div>
            </template>

            Contact #{it.index}: {it.value.Name}

            <template if:true={it.last}>
                <div>End of list</div>
            </template>
        </div>
    </template>
</template>
```

## Data Binding

### One-Way Binding

```html
<template>
    <!-- Property binding -->
    <lightning-input value={myValue}></lightning-input>

    <!-- Attribute binding -->
    <div class={dynamicClass}></div>

    <!-- Boolean attributes -->
    <lightning-button disabled={isDisabled}></lightning-button>
</template>
```

### Two-Way Binding (Through Events)

```javascript
// JavaScript
export default class TwoWayBinding extends LightningElement {
    inputValue = '';

    handleInputChange(event) {
        this.inputValue = event.target.value;
    }
}
```

```html
<!-- HTML -->
<template>
    <lightning-input
        value={inputValue}
        onchange={handleInputChange}>
    </lightning-input>
    <p>You typed: {inputValue}</p>
</template>
```

## Getters and Setters

```javascript
export default class GetterSetter extends LightningElement {
    firstName = '';
    lastName = '';

    // Getter
    get fullName() {
        return `${this.firstName} ${this.lastName}`.trim();
    }

    // Setter with validation
    _age;

    @api
    get age() {
        return this._age;
    }

    set age(value) {
        if (value < 0 || value > 150) {
            throw new Error('Invalid age value');
        }
        this._age = value;
    }
}
```

## Best Practices

1. **Use Consistent Naming**: Follow camelCase for JavaScript, kebab-case for HTML attributes
2. **Keep Components Small**: Single responsibility principle
3. **Use Base Components**: Leverage lightning-* components when possible
4. **Handle Errors**: Always include error handling in wire adapters and imperative calls
5. **Optimize Rendering**: Use key attribute in loops for better performance
6. **Document Your Code**: Add JSDoc comments for better maintainability

## Common Patterns

### Loading State Pattern

```javascript
export default class LoadingPattern extends LightningElement {
    @track isLoading = true;
    @track error;
    @track data;

    connectedCallback() {
        this.loadData();
    }

    async loadData() {
        try {
            this.isLoading = true;
            this.data = await fetchData();
        } catch (error) {
            this.error = error.message;
        } finally {
            this.isLoading = false;
        }
    }
}
```

### Parent-Child Communication

```javascript
// Parent Component
export default class ParentComponent extends LightningElement {
    handleChildEvent(event) {
        const detail = event.detail;
        // Handle data from child
    }
}

// Child Component
export default class ChildComponent extends LightningElement {
    notifyParent() {
        this.dispatchEvent(new CustomEvent('notify', {
            detail: { message: 'Hello Parent' }
        }));
    }
}
```
