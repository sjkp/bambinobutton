function read(query, user, request) {
    mssql.query('select distinct [language] from bambinobutton.song where url is not null',
    {success: function(res) {
        var arr = res.map(function(i) {return i.language});
        
        query.where(function(lan) {
            return this.lcid in lan;
        },arr);
        
        request.execute();
            
        
            
    },
    error: function(err)
    {
        console.log(err);    
    }
    });
    

}