import { CreateSkinLogData, CreateSkinLogVariables, GetProductsData, AddRoutineStepData, AddRoutineStepVariables, GetUserSkinConcernsData, GetUserSkinConcernsVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateSkinLog(options?: useDataConnectMutationOptions<CreateSkinLogData, FirebaseError, CreateSkinLogVariables>): UseDataConnectMutationResult<CreateSkinLogData, CreateSkinLogVariables>;
export function useCreateSkinLog(dc: DataConnect, options?: useDataConnectMutationOptions<CreateSkinLogData, FirebaseError, CreateSkinLogVariables>): UseDataConnectMutationResult<CreateSkinLogData, CreateSkinLogVariables>;

export function useGetProducts(options?: useDataConnectQueryOptions<GetProductsData>): UseDataConnectQueryResult<GetProductsData, undefined>;
export function useGetProducts(dc: DataConnect, options?: useDataConnectQueryOptions<GetProductsData>): UseDataConnectQueryResult<GetProductsData, undefined>;

export function useAddRoutineStep(options?: useDataConnectMutationOptions<AddRoutineStepData, FirebaseError, AddRoutineStepVariables>): UseDataConnectMutationResult<AddRoutineStepData, AddRoutineStepVariables>;
export function useAddRoutineStep(dc: DataConnect, options?: useDataConnectMutationOptions<AddRoutineStepData, FirebaseError, AddRoutineStepVariables>): UseDataConnectMutationResult<AddRoutineStepData, AddRoutineStepVariables>;

export function useGetUserSkinConcerns(vars: GetUserSkinConcernsVariables, options?: useDataConnectQueryOptions<GetUserSkinConcernsData>): UseDataConnectQueryResult<GetUserSkinConcernsData, GetUserSkinConcernsVariables>;
export function useGetUserSkinConcerns(dc: DataConnect, vars: GetUserSkinConcernsVariables, options?: useDataConnectQueryOptions<GetUserSkinConcernsData>): UseDataConnectQueryResult<GetUserSkinConcernsData, GetUserSkinConcernsVariables>;
