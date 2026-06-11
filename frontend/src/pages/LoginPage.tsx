import { useState } from 'react' //useState: 리액트에서 값 기억하게 해주는 함수
import { login } from '../api/authApi';
import type { SubmitEventHandler } from 'react'; //이벤트 핸들러 타입 가져옴
import { useNavigate } from 'react-router'; //어디로 이동할지

function LoginPage() {
    //useState는 길이 2짜리 배열 [현재 상태값, 상태 변환 함수]반환. 
    //setEmail은 상태가 바뀌었다고 리액트에게 알려주는 함수. useState가 함수를 리턴하기때문에 변수로 받는다.
    //useState('') : 리액트 문법, React에게 상태값 하나를 만들어달라고 요청. 초기값은 ''로 해라.
    const [email, setEmail] = useState('') 
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    //handleSubmit이라는 상수는 HTMLformsubmit처리 함수를 넣을건데, 실제 함수는 async(event) => {}다.
    //로그인 요청 들어왔을 때 실행되는 내용
    const handleSubmit: SubmitEventHandler<HTMLFormElement> = 
    async (event) => {
        event.preventDefault(); //form 제출할 때 페이지 전체 새로고침 막기
        const response = await login(email, password); // 백엔드에 로그인 요청 보내고 응답 받아서 response에 저장

        if (!response.ok) { //로그인 틀리면
            setErrorMessage('이메일이나 비밀번호가 올바르지 않습니다.');
            return;
        }

        const data = await response.json(); //jwt토큰 저장을 위해서
        localStorage.setItem('accessToken', data.accessToken); //로컬 저장소에 엑세스토큰 저장
        navigate('/'); //홈으로 이동
    };


    return ( 
        <main> {/* 페이지의 주요 콘텐츠 영역 */}
            <h1>로그인</h1>

            <form onSubmit= {handleSubmit}>
                <label> {/* 입력창에 설명을 붙이는 태그 */}
                    {/* type:이 입력창이 무슨 용도인지 type="정해진문자열값"으로 쓰면 브라우저가 용도를 알아먹음, value: 현재 상태값, 
                    onChange:사용자가 input에 글자입력할때마다 해당 함수를 실행해라. 원형은 onChange={함수}구조임. */}
                    이메일 <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                </label>

                <label>
                    비밀번호 <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                </label>

                <button type="submit">로그인</button> {/*로그인 버튼을 누르면 폼 안에 있는 내용을 제출*/}

                {errorMessage && <p>{errorMessage}</p>} {/* A && B : A가 false면 A리턴, A가 true면 B리턴 */}
            </form>
        </main>
    )
}

export default LoginPage