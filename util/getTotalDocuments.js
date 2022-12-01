
exports.getTotalDocuments = async (Model, sort, query) => {
    let total = 0
  
    if(query) {
        
        if(sort) {
            total = await Model.find(query)
              .sort(sort)
              .count();
        } else {
            total = await Model.find(query)
              .count();
        }

    } else {

        if(sort) {
            total = await Model.find()
              .sort(sort)
              .count();
        } else {
            total = await Model
                .find()
                .count();
        }

    }
      
  
    return total
}




  