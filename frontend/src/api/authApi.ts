export async function login(email: string, password: string) {
    const response = await fetch('http://localhost:3000/auth/login', { //백엔드 로그인 주소로 HTTP요청을 보내고 응답 대기
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', //내가 보내는 데이터는 JSON임
        },
        body: JSON.stringify({ //JSON문자열로 바꿔서 body에 담음
            email,
            password,
        }),
    });

    return response;
}

export async function register(email: string, nickname: string, password: string) {
    return fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            nickname,
            password,
        }),
    });
}

export async function getMe() {
    const accessToken = localStorage.getItem('accessToken'); //로컬 저장소(브라우저)에서 jwt토큰 뺌

    return fetch('http://localhost:3000/auth/me', { //토큰 유효하면 유저정보 얻어오는 구조
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}