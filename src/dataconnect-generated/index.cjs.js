const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'glowbot',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createSkinLogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateSkinLog', inputVars);
}
createSkinLogRef.operationName = 'CreateSkinLog';
exports.createSkinLogRef = createSkinLogRef;

exports.createSkinLog = function createSkinLog(dcOrVars, vars) {
  return executeMutation(createSkinLogRef(dcOrVars, vars));
};

const getProductsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetProducts');
}
getProductsRef.operationName = 'GetProducts';
exports.getProductsRef = getProductsRef;

exports.getProducts = function getProducts(dc) {
  return executeQuery(getProductsRef(dc));
};

const addRoutineStepRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddRoutineStep', inputVars);
}
addRoutineStepRef.operationName = 'AddRoutineStep';
exports.addRoutineStepRef = addRoutineStepRef;

exports.addRoutineStep = function addRoutineStep(dcOrVars, vars) {
  return executeMutation(addRoutineStepRef(dcOrVars, vars));
};

const getUserSkinConcernsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserSkinConcerns', inputVars);
}
getUserSkinConcernsRef.operationName = 'GetUserSkinConcerns';
exports.getUserSkinConcernsRef = getUserSkinConcernsRef;

exports.getUserSkinConcerns = function getUserSkinConcerns(dcOrVars, vars) {
  return executeQuery(getUserSkinConcernsRef(dcOrVars, vars));
};
