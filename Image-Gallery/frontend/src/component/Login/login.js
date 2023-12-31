import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function App(){
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

    async function loginUser(event){
        event.preventDefault();

        const response = await fetch('http://localhost:5000/api/login',{
            method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
            body: JSON.stringify({
                email,
                password,
            })
        })

        const data= await response.json();
        if (data.user) {
			localStorage.setItem('token', data.user)
			localStorage.setItem('username', data.username)
			alert('Login successful')
			navigate('/profile')
		} else {
			alert('Please check your username and password')
		}
        console.log(data);
    }
    return (
        <div>
            <h1>Login app</h1>
            <form onSubmit={loginUser}>
            <input
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					type="email"
					placeholder="Email"
				/>
				<br />
				<input
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					type="password"
					placeholder="Password"
				/>
				<br />
				<input type="submit" value="Login" />
            </form>
        </div>
    )
}
export default App;