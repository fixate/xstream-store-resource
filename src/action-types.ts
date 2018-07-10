const createActionTypeGroup = (methodName: string, resxName: string) => ({
  [`${methodName.toUpperCase()}`]: `@${resxName}/${methodName.toLowerCase()}`,
  [`${methodName.toUpperCase()}_SUCCESS`]: `@${resxName}/${methodName.toLowerCase()}-success`,
  [`${methodName.toUpperCase()}_FAILURE`]: `@${resxName}/${methodName.toLowerCase()}-failure`,
});

const createActionTypes = (name: string) => {
  return {
    ...createActionTypeGroup('get', name),
    ...createActionTypeGroup('find', name),
    ...createActionTypeGroup('create', name),
    ...createActionTypeGroup('patch', name),
    ...createActionTypeGroup('update', name),
    ...createActionTypeGroup('remove', name),
    RESET: `${name}/reset`,
  };
};

export default createActionTypes;
