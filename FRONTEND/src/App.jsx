import './App.css'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import { Button } from '@heroui/react';

function App() {
  return (
    <>
    <div>
      <h1 className="text-blue-500 @max-4xl: font-bold">Welcome to the Chat App</h1> 
       <Button>My Button</Button>
       <header></header>
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
        </div>
    </>
  )
}

export default App