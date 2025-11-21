# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetProducts*](#getproducts)
  - [*GetUserSkinConcerns*](#getuserskinconcerns)
- [**Mutations**](#mutations)
  - [*CreateSkinLog*](#createskinlog)
  - [*AddRoutineStep*](#addroutinestep)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetProducts
You can execute the `GetProducts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getProducts(): QueryPromise<GetProductsData, undefined>;

interface GetProductsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetProductsData, undefined>;
}
export const getProductsRef: GetProductsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getProducts(dc: DataConnect): QueryPromise<GetProductsData, undefined>;

interface GetProductsRef {
  ...
  (dc: DataConnect): QueryRef<GetProductsData, undefined>;
}
export const getProductsRef: GetProductsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getProductsRef:
```typescript
const name = getProductsRef.operationName;
console.log(name);
```

### Variables
The `GetProducts` query has no variables.
### Return Type
Recall that executing the `GetProducts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetProductsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetProductsData {
  products: ({
    id: UUIDString;
    name: string;
    brand: string;
    description?: string | null;
    imageUrl?: string | null;
    productType: string;
    ingredients?: string[] | null;
  } & Product_Key)[];
}
```
### Using `GetProducts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getProducts } from '@dataconnect/generated';


// Call the `getProducts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getProducts();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getProducts(dataConnect);

console.log(data.products);

// Or, you can use the `Promise` API.
getProducts().then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

### Using `GetProducts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getProductsRef } from '@dataconnect/generated';


// Call the `getProductsRef()` function to get a reference to the query.
const ref = getProductsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getProductsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.products);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

## GetUserSkinConcerns
You can execute the `GetUserSkinConcerns` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserSkinConcerns(vars: GetUserSkinConcernsVariables): QueryPromise<GetUserSkinConcernsData, GetUserSkinConcernsVariables>;

interface GetUserSkinConcernsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserSkinConcernsVariables): QueryRef<GetUserSkinConcernsData, GetUserSkinConcernsVariables>;
}
export const getUserSkinConcernsRef: GetUserSkinConcernsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserSkinConcerns(dc: DataConnect, vars: GetUserSkinConcernsVariables): QueryPromise<GetUserSkinConcernsData, GetUserSkinConcernsVariables>;

interface GetUserSkinConcernsRef {
  ...
  (dc: DataConnect, vars: GetUserSkinConcernsVariables): QueryRef<GetUserSkinConcernsData, GetUserSkinConcernsVariables>;
}
export const getUserSkinConcernsRef: GetUserSkinConcernsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserSkinConcernsRef:
```typescript
const name = getUserSkinConcernsRef.operationName;
console.log(name);
```

### Variables
The `GetUserSkinConcerns` query requires an argument of type `GetUserSkinConcernsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserSkinConcernsVariables {
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `GetUserSkinConcerns` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserSkinConcernsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserSkinConcernsData {
  userSkinConcerns: ({
    skinConcern: {
      id: UUIDString;
      name: string;
      description: string;
    } & SkinConcern_Key;
      severity?: number | null;
  })[];
}
```
### Using `GetUserSkinConcerns`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserSkinConcerns, GetUserSkinConcernsVariables } from '@dataconnect/generated';

// The `GetUserSkinConcerns` query requires an argument of type `GetUserSkinConcernsVariables`:
const getUserSkinConcernsVars: GetUserSkinConcernsVariables = {
  userId: ..., 
};

// Call the `getUserSkinConcerns()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserSkinConcerns(getUserSkinConcernsVars);
// Variables can be defined inline as well.
const { data } = await getUserSkinConcerns({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserSkinConcerns(dataConnect, getUserSkinConcernsVars);

console.log(data.userSkinConcerns);

// Or, you can use the `Promise` API.
getUserSkinConcerns(getUserSkinConcernsVars).then((response) => {
  const data = response.data;
  console.log(data.userSkinConcerns);
});
```

### Using `GetUserSkinConcerns`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserSkinConcernsRef, GetUserSkinConcernsVariables } from '@dataconnect/generated';

// The `GetUserSkinConcerns` query requires an argument of type `GetUserSkinConcernsVariables`:
const getUserSkinConcernsVars: GetUserSkinConcernsVariables = {
  userId: ..., 
};

// Call the `getUserSkinConcernsRef()` function to get a reference to the query.
const ref = getUserSkinConcernsRef(getUserSkinConcernsVars);
// Variables can be defined inline as well.
const ref = getUserSkinConcernsRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserSkinConcernsRef(dataConnect, getUserSkinConcernsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userSkinConcerns);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userSkinConcerns);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateSkinLog
You can execute the `CreateSkinLog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createSkinLog(vars: CreateSkinLogVariables): MutationPromise<CreateSkinLogData, CreateSkinLogVariables>;

interface CreateSkinLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSkinLogVariables): MutationRef<CreateSkinLogData, CreateSkinLogVariables>;
}
export const createSkinLogRef: CreateSkinLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSkinLog(dc: DataConnect, vars: CreateSkinLogVariables): MutationPromise<CreateSkinLogData, CreateSkinLogVariables>;

interface CreateSkinLogRef {
  ...
  (dc: DataConnect, vars: CreateSkinLogVariables): MutationRef<CreateSkinLogData, CreateSkinLogVariables>;
}
export const createSkinLogRef: CreateSkinLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSkinLogRef:
```typescript
const name = createSkinLogRef.operationName;
console.log(name);
```

### Variables
The `CreateSkinLog` mutation requires an argument of type `CreateSkinLogVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateSkinLogVariables {
  userId: UUIDString;
  imageUrl: string;
  logDate: DateString;
  overallRating?: number | null;
  userNotes?: string | null;
}
```
### Return Type
Recall that executing the `CreateSkinLog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSkinLogData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSkinLogData {
  skinLog_insert: SkinLog_Key;
}
```
### Using `CreateSkinLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSkinLog, CreateSkinLogVariables } from '@dataconnect/generated';

// The `CreateSkinLog` mutation requires an argument of type `CreateSkinLogVariables`:
const createSkinLogVars: CreateSkinLogVariables = {
  userId: ..., 
  imageUrl: ..., 
  logDate: ..., 
  overallRating: ..., // optional
  userNotes: ..., // optional
};

// Call the `createSkinLog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSkinLog(createSkinLogVars);
// Variables can be defined inline as well.
const { data } = await createSkinLog({ userId: ..., imageUrl: ..., logDate: ..., overallRating: ..., userNotes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSkinLog(dataConnect, createSkinLogVars);

console.log(data.skinLog_insert);

// Or, you can use the `Promise` API.
createSkinLog(createSkinLogVars).then((response) => {
  const data = response.data;
  console.log(data.skinLog_insert);
});
```

### Using `CreateSkinLog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSkinLogRef, CreateSkinLogVariables } from '@dataconnect/generated';

// The `CreateSkinLog` mutation requires an argument of type `CreateSkinLogVariables`:
const createSkinLogVars: CreateSkinLogVariables = {
  userId: ..., 
  imageUrl: ..., 
  logDate: ..., 
  overallRating: ..., // optional
  userNotes: ..., // optional
};

// Call the `createSkinLogRef()` function to get a reference to the mutation.
const ref = createSkinLogRef(createSkinLogVars);
// Variables can be defined inline as well.
const ref = createSkinLogRef({ userId: ..., imageUrl: ..., logDate: ..., overallRating: ..., userNotes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSkinLogRef(dataConnect, createSkinLogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.skinLog_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.skinLog_insert);
});
```

## AddRoutineStep
You can execute the `AddRoutineStep` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addRoutineStep(vars: AddRoutineStepVariables): MutationPromise<AddRoutineStepData, AddRoutineStepVariables>;

interface AddRoutineStepRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddRoutineStepVariables): MutationRef<AddRoutineStepData, AddRoutineStepVariables>;
}
export const addRoutineStepRef: AddRoutineStepRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addRoutineStep(dc: DataConnect, vars: AddRoutineStepVariables): MutationPromise<AddRoutineStepData, AddRoutineStepVariables>;

interface AddRoutineStepRef {
  ...
  (dc: DataConnect, vars: AddRoutineStepVariables): MutationRef<AddRoutineStepData, AddRoutineStepVariables>;
}
export const addRoutineStepRef: AddRoutineStepRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addRoutineStepRef:
```typescript
const name = addRoutineStepRef.operationName;
console.log(name);
```

### Variables
The `AddRoutineStep` mutation requires an argument of type `AddRoutineStepVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddRoutineStepVariables {
  userId: UUIDString;
  productId?: UUIDString | null;
  createdAt: TimestampString;
  notes?: string | null;
  recurrence?: string | null;
  stepNumber: number;
  timeOfDay: string;
}
```
### Return Type
Recall that executing the `AddRoutineStep` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddRoutineStepData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddRoutineStepData {
  routineStep_insert: RoutineStep_Key;
}
```
### Using `AddRoutineStep`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addRoutineStep, AddRoutineStepVariables } from '@dataconnect/generated';

// The `AddRoutineStep` mutation requires an argument of type `AddRoutineStepVariables`:
const addRoutineStepVars: AddRoutineStepVariables = {
  userId: ..., 
  productId: ..., // optional
  createdAt: ..., 
  notes: ..., // optional
  recurrence: ..., // optional
  stepNumber: ..., 
  timeOfDay: ..., 
};

// Call the `addRoutineStep()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addRoutineStep(addRoutineStepVars);
// Variables can be defined inline as well.
const { data } = await addRoutineStep({ userId: ..., productId: ..., createdAt: ..., notes: ..., recurrence: ..., stepNumber: ..., timeOfDay: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addRoutineStep(dataConnect, addRoutineStepVars);

console.log(data.routineStep_insert);

// Or, you can use the `Promise` API.
addRoutineStep(addRoutineStepVars).then((response) => {
  const data = response.data;
  console.log(data.routineStep_insert);
});
```

### Using `AddRoutineStep`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addRoutineStepRef, AddRoutineStepVariables } from '@dataconnect/generated';

// The `AddRoutineStep` mutation requires an argument of type `AddRoutineStepVariables`:
const addRoutineStepVars: AddRoutineStepVariables = {
  userId: ..., 
  productId: ..., // optional
  createdAt: ..., 
  notes: ..., // optional
  recurrence: ..., // optional
  stepNumber: ..., 
  timeOfDay: ..., 
};

// Call the `addRoutineStepRef()` function to get a reference to the mutation.
const ref = addRoutineStepRef(addRoutineStepVars);
// Variables can be defined inline as well.
const ref = addRoutineStepRef({ userId: ..., productId: ..., createdAt: ..., notes: ..., recurrence: ..., stepNumber: ..., timeOfDay: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addRoutineStepRef(dataConnect, addRoutineStepVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.routineStep_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.routineStep_insert);
});
```

