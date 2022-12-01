
exports.getTotalDocuments = async (Model, page, limit, sort, query) => {
    let total = 0
  
    if(query) {
        
        if(sort) {
            total = await Model.find(query)
              .sort(sort)
              .skip(page * limit)
              .limit(limit)
              .count();
        } else {
            total = await Model.find(query)
              .skip(page * limit)
              .limit(limit)
              .count();
        }

    } else {

        if(sort) {
            total = await Model.find()
              .sort(sort)
              .skip(page * limit)
              .limit(limit)
              .count();
        } else {
            total = await Model.find()
                .skip(page * limit)
                .limit(limit)
                .count();
        }

    }
      
  
    return total
}




  