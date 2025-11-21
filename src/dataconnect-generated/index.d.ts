import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddRoutineStepData {
  routineStep_insert: RoutineStep_Key;
}

export interface AddRoutineStepVariables {
  userId: UUIDString;
  productId?: UUIDString | null;
  createdAt: TimestampString;
  notes?: string | null;
  recurrence?: string | null;
  stepNumber: number;
  timeOfDay: string;
}

export interface CreateSkinLogData {
  skinLog_insert: SkinLog_Key;
}

export interface CreateSkinLogVariables {
  userId: UUIDString;
  imageUrl: string;
  logDate: DateString;
  overallRating?: number | null;
  userNotes?: string | null;
}

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

export interface GetUserSkinConcernsVariables {
  userId: UUIDString;
}

export interface Product_Key {
  id: UUIDString;
  __typename?: 'Product_Key';
}

export interface RoutineStep_Key {
  id: UUIDString;
  __typename?: 'RoutineStep_Key';
}

export interface SkinConcern_Key {
  id: UUIDString;
  __typename?: 'SkinConcern_Key';
}

export interface SkinLog_Key {
  id: UUIDString;
  __typename?: 'SkinLog_Key';
}

export interface UserSkinConcern_Key {
  userId: UUIDString;
  skinConcernId: UUIDString;
  __typename?: 'UserSkinConcern_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateSkinLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSkinLogVariables): MutationRef<CreateSkinLogData, CreateSkinLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateSkinLogVariables): MutationRef<CreateSkinLogData, CreateSkinLogVariables>;
  operationName: string;
}
export const createSkinLogRef: CreateSkinLogRef;

export function createSkinLog(vars: CreateSkinLogVariables): MutationPromise<CreateSkinLogData, CreateSkinLogVariables>;
export function createSkinLog(dc: DataConnect, vars: CreateSkinLogVariables): MutationPromise<CreateSkinLogData, CreateSkinLogVariables>;

interface GetProductsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetProductsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetProductsData, undefined>;
  operationName: string;
}
export const getProductsRef: GetProductsRef;

export function getProducts(): QueryPromise<GetProductsData, undefined>;
export function getProducts(dc: DataConnect): QueryPromise<GetProductsData, undefined>;

interface AddRoutineStepRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddRoutineStepVariables): MutationRef<AddRoutineStepData, AddRoutineStepVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddRoutineStepVariables): MutationRef<AddRoutineStepData, AddRoutineStepVariables>;
  operationName: string;
}
export const addRoutineStepRef: AddRoutineStepRef;

export function addRoutineStep(vars: AddRoutineStepVariables): MutationPromise<AddRoutineStepData, AddRoutineStepVariables>;
export function addRoutineStep(dc: DataConnect, vars: AddRoutineStepVariables): MutationPromise<AddRoutineStepData, AddRoutineStepVariables>;

interface GetUserSkinConcernsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserSkinConcernsVariables): QueryRef<GetUserSkinConcernsData, GetUserSkinConcernsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserSkinConcernsVariables): QueryRef<GetUserSkinConcernsData, GetUserSkinConcernsVariables>;
  operationName: string;
}
export const getUserSkinConcernsRef: GetUserSkinConcernsRef;

export function getUserSkinConcerns(vars: GetUserSkinConcernsVariables): QueryPromise<GetUserSkinConcernsData, GetUserSkinConcernsVariables>;
export function getUserSkinConcerns(dc: DataConnect, vars: GetUserSkinConcernsVariables): QueryPromise<GetUserSkinConcernsData, GetUserSkinConcernsVariables>;

