function read(query, user, request) {
    query.where(function() {
        return this.url !== null;
    });
    tables.getTable('log').insert({createdOn: new Date()});
    request.execute();

}