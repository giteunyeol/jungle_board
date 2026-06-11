import { useState } from 'react';
import { register } from '../api/authApi';
import { useNavigate } from 'react-router';
import type { SubmitEventHandler } from 'react';

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit: SubmitEventHandler<HTMLFormElement> =
        async (event) => {
            event.preventDefault(); //한번에 화면 새로고침 안함

            const response = await register(email, nickname, password); //회원가입 결과 받아옴

            if(!response.ok) {
                setErrorMessage('회원가입에 실패했습니다.');
                return;
            }

            navigate('/login');
        }

    return (
        <main>
            <h1>회원가입</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    이메일
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)}/>
                </label>

                <label>
                    닉네임
                    <input type="text" value={nickname} onChange={(event) => setNickname(event.target.value)}/>
                </label>

                <label>
                    비밀번호
                    <input type="password" value={password} onChange={(event) =>setPassword(event.target.value)}/>
                </label>

                <button type="submit">회원가입</button>

                {errorMessage && <p>{errorMessage}</p>} 
            </form>
        </main>
    )
};

export default RegisterPage