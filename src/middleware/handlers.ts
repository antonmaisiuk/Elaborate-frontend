import React from "react";
// import { useNavigate } from "react-router-dom";

const apiUrl = 'https://localhost:7247';
// export const handleLogin = async (
//   e: React.FormEvent<HTMLFormElement>,
//   formData: {},
//   setErrorMsg: React.Dispatch<React.SetStateAction<string>>,
//   setIs2FA:  React.Dispatch<React.SetStateAction<boolean>>,
// ) => {
//   const navigate = useNavigate();
//
//   e.preventDefault()
//   const response = await fetch(`${apiUrl}/api/Authentication/login`,
//     {
//       method: 'POST',
//       headers: {'Content-Type': 'application/json'},
//
//       body: JSON.stringify(formData)
//     })
//
//   if (response.ok) {
//     const isTwoFactorEnabled = /sent/.test(JSON.parse(await response.text()).message);
//     console.log('👉 isTwoFactorEnabled: ', isTwoFactorEnabled);
//     isTwoFactorEnabled ? setIs2FA(true) : navigate('/overview')
//   } else {
//     const errorMsg = JSON.parse(await response.text());
//     setErrorMsg(errorMsg.message);
//     console.log(errorMsg.message);
//   }
// };
