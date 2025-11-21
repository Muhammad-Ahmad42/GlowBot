import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'glowbot',
  location: 'us-east4'
};

export const createSkinLogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateSkinLog', inputVars);
}
createSkinLogRef.operationName = 'CreateSkinLog';

export function createSkinLog(dcOrVars, vars) {
  return executeMutation(createSkinLogRef(dcOrVars, vars));
}

export const getProductsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetProducts');
}
getProductsRef.operationName = 'GetProducts';

export function getProducts(dc) {
  return executeQuery(getProductsRef(dc));
}

export const addRoutineStepRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddRoutineStep', inputVars);
}
addRoutineStepRef.operationName = 'AddRoutineStep';

export function addRoutineStep(dcOrVars, vars) {
  return executeMutation(addRoutineStepRef(dcOrVars, vars));
}

export const getUserSkinConcernsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserSkinConcerns', inputVars);
}
getUserSkinConcernsRef.operationName = 'GetUserSkinConcerns';

export function getUserSkinConcerns(dcOrVars, vars) {
  return executeQuery(getUserSkinConcernsRef(dcOrVars, vars));
}

