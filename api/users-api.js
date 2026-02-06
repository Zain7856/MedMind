
export function getUsers(){
 const Users_List = [];



 return Users_List;
   
 
    
}
    
export function getUserById(id){
 const User_Details = {};
    

   return User_Details;
}

export function createUser(user){
     const User_requariyFields = ['Name', 'Email', 'Password', 'Age', 'Phone', 'Role'];
     const missingFields = User_requariyFields.filter(field => !user[field]);
     
     if (missingFields.length > 0) {
         throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
     }



     
     return user;
}


