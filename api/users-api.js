const baseUrl = 'http://localhost:3000';

export function getUsers(){
 const Users_List = [];



 return Users_List;
   
 
    
}
    
export function getUserById(id){
 const User_Details = {};
    

   return User_Details;
}

export async function createUser(user){
     const User_requariyFields = ['Name', 'Email', 'Password', 'Age', 'Phone', 'Role'];
     const missingFields = User_requariyFields.filter(field => !user[field]);
     
     if (missingFields.length > 0) {
         throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
     }

     try {
         const response = await fetch(`${baseUrl}/users`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(user)
         });
         
         if (!response.ok) {
             const error = await response.text();
             throw new Error(error || 'Failed to create user');
         }
         
         return await response.json();
     } catch (error) {
         console.error('Error creating user:', error);
         throw error;
     }
}
