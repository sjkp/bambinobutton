function read(query, user, request) {
    tables.getTable('log').insert({createdOn: new Date()});
    request.execute();

}