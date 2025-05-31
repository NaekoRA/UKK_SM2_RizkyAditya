import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import Swal from "sweetalert2";

const Register = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new URLSearchParams()
        formData.append('username', username)
        formData.append('email', email)
        formData.append('password', password)

        try {
            const response = await fetch('http://localhost:5000/api/users/regis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
                mode: 'cors'
            })
            if (response.ok) {
                Swal.fire({
                    title: 'Success',
                    text: 'Registration Success',
                    icon: 'success',
                    showCancelButton: false,
                    timer: 1500
                })
                navigate('/login')
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Registration Failed',
                    icon: 'error',
                    timer: 1500
                })
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Registration Failed',
                icon: 'error',
                timer: 1500
            })
        }
    
    }
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 centerL" style={{ minWidth: "350px", maxWidth: "400px", width: "100%" }}>
                <h3 className="text-center mb-4">register</h3>
                <form onSubmit={handleSubmit}>
                    <input type="text" className="form-control mb-3" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)}required />
                    <input type="email" className="form-control mb-3" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}required />
                    <input type="password" className="form-control mb-3" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}required />
                    <button type="submit" className="btn btn-primary w-100">Register</button>
                </form>
                <div className="mt-3 text-center">
                    <Link to='/login'>Already have account? Login here</Link>
                </div>
            </div>
        </div>
    )
}
export default Register;