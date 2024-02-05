

- Music
- Business
- Spors
 - Hobbies
- arts 

- Bandung
- Surabaya
- Jakarta
- Tangerang
- Denpasar
- Medan

{
  "eventName": "live music",
  "date": "Tue Jan 23 2024 07:00:00 GMT+0700 (Western Indonesia Time)",
  "price": 300000,
  "availableSeat": 1000,
  "description": "live music for charity",
  "category": "music"
  "location": "jakarta"
}


 ## REPOSITOORY
 1. 
  referredBy User?      @relation("Referral", fields: [referral], references: [id])
  referred   User[]     @relation("Referral")


2. 
    // const payload: RegisteredPayload = {
  //   ...req.body,
  //   password: hash(req.body.password),
  //   referral: paddedNumber
  // };

3. yup validation

// export const registerSchema = object({
//   body: object({
//     username: string().min(6, "Minimum name is 6 character").max(30, "Maximum is 30 character").required("Username is required"),
//     email: string().email().required("Email is required"),
//     password: string().min(6, "minimum length of password is 16").max(16, "Maximum length of password is 16").required("Password is required"),
//     role: string().required()
//   }),
// });

## add Image handler
// export const addNewImage = async (req: Request, res: Response, ) => {
//   try {
//     const { file } = req;

//     if(!file) throw new Error("No File Uploaded")
    
//     return res.status(200).json({
//       code: 200,
//       message: `file ${file.filename} successfully uploaded`
//     })
//   } catch(error: any) {
//     console.log("@@@ postEvent error", error.message || error);
//     return res.status(500).json({
//       code: 500,
//       message: "Internal Server Error | newImage",
//     })
//   }
// }

  

