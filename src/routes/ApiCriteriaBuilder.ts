export default interface ApiCriteriaBuilder {
    headers?(): any;
    authRequired?: Boolean;
    hasPermission?: Boolean;
    body?(): any;
    query?(): any;
    model?(): any;
    next?(): any;
    permissionDeniedToUpdate?(): any;
};
