import { RegisterForm } from '@/components/auth/register-form';
import { Logo } from '@/components/logo';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <Logo className="h-12 w-12" />
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-muted-foreground text-center">
            Enter your details to create your account
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
// 'use client'

// import { useEffect, useState } from 'react'
// import {
//   initiateSocket,
//   disconnectSocket,
//   subscribeToChat,
//   sendMessage,
// } from '@/lib/socket'

// export default function ChatPage() {
//   const [message, setMessage] = useState('')
//   const [chat, setChat] = useState<string[]>([])

//   useEffect(() => {
//     initiateSocket()
//     subscribeToChat((msg) => setChat((prev) => [...prev, msg]))

//     return () => {
//       disconnectSocket()
//     }
//   }, [])

//   const handleSend = () => {
//     sendMessage(message)
//     setChat((prev) => [...prev, `You: ${message}`])
//     setMessage('')
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4">Socket Chat</h1>
//       <div className="border p-4 h-64 overflow-y-scroll mb-4">
//         {chat.map((msg, idx) => (
//           <div key={idx}>{msg}</div>
//         ))}
//       </div>
//       <input
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Type message"
//         className="border p-2 mr-2"
//       />
//       <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2">
//         Send
//       </button>
//     </div>
//   )
// }
