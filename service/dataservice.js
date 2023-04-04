const jwt=require("jsonwebtoken")
const db=require('./db')


register = (acno, uname, psw)=> {
                  
    //store the resolved output of findOne in a variable user

    return db.User.findOne({acno}).then(user=>{

        //if acno present in db then get the object of that user else null response
        if(user)
        {
            return{
                status: false,
            message: "user already present",
            statusCode: 404
            }
        }

        else{
           newUser=new db.User({
                username:uname,
                acno,
                password:psw,
                balance:0,
                transaction:[]
            })

            newUser.save()
            return{
                status: true,
                message: "registered",
                statusCode: 200
            }
        }
    })
}

 login=(acno,psw)=>{
    return db.User.findOne({acno,password:psw}).then(user=>{
        if(user)
        {
            currentUser=user.username
            currentAcno=acno
            const token =jwt.sign({acno},"superkey123") 
            return{
                status:true,
                message:"login success",
                statusCode:200,
                currentUser,
                currentAcno,
                token
            }
        }
        
        else
        {
            return{
                status:false,
                message:"incorrect acno or password",
                statusCode:404
        }
    }
    })
    
 }
                 


//deposit

deposit=(acno,psw,amnt)=>{

var amount=parseInt(amnt)
return db.User.findOne({acno,password:psw}).then(user=>{

    if(user)
    {
        user.balance+=amount
       user.transactions.push({Type:"credit",Amount:amnt})
        user.save()
        return{
            status:true,
            message:`your ac has been credited with amount ${amount} and the balance is ${user.balance}`,
            statusCode:200
         }
    }
    else
    {
        return{
            status:false,
            message:"incorrect acno or password",
            statusCode:404
    }
    }
})


}

// //withdraw patch
 

withdraw=(acno,psw,amnt)=>{

    var amount=parseInt(amnt)
    return db.User.findOne({acno,password:psw}).then(user=>{
        
            if(user)
            {
                if(user.balance>=amount)
                {
                    user.balance-=amount
                    user.transactions.push({Type:"debit",Amount:amount})
                    user.save()
                    return{
                        status:true,
                    message:`your ac has been debited with amount ${amount} and the balance is ${user.balance}`,
                    statusCode:200
                    }

                }

                else{
                    return{
                        status:false,
                message:"insufficient balance",
                statusCode:404
                    }
                }
            }           
        else
        {
         return{
             status:false,
             message:"incorrect  acno or password",
             statusCode:404
           }
        }
        
    })       
 }
    
     
    
    // //transaction get
    
    
    getTransaction=(acno)=>{
        return db.User.findOne({acno}).then(user=>{

if (user)
{
    return {
        status:true,
        transactions:user.transactions,
        statusCode: 200
    }
        
}
    })
}
    
    // //delete delete


    deleteAcc=(acno)=>{
        return db.User.deleteOne({acno}).then(user=>{
            if(user)
            {
                return {
                    status:true,
                    message:"ac deleted",
                    statusCode: 200
                }  
            }
            else{
                return{
                    status:false,
                    message:"ac not present",
                    statusCode:401
                  }
            }
        })
    }
    
    // //resolve api
    
    
    
    module.exports = {
        register,login, deposit,withdraw,getTransaction,deleteAcc
    }