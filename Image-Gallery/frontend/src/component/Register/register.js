import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function App(){
    const navigate = useNavigate();
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

    async function registerUser(event){
        event.preventDefault();

        const response = await fetch('http://localhost:5000/api/register',{
            method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
            body: JSON.stringify({
                username,
                name,
                email,
                password,
            })
        })

        const data= await response.json();
        if (data.status === 'ok') {
			navigate('/login')
		}
        console.log(data);
    }
    return (  
        <div>
             <h1>Register app</h1>
            <form onSubmit={registerUser}>
            <input
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					type="text"
					placeholder="Name"
				/>
				<br />
            <input
					value={name}
					onChange={(e) => setName(e.target.value)}
					type="text"
					placeholder="Name"
				/>
				<br />
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
				<input type="submit" value="Register" />
            </form>
        </div>
    )
}
export default App;