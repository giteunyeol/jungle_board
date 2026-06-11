export async function getPosts(search = '', page = 1) { //백엔드에서 게시글 목록 가져오는 함수, 검색어가 없으면 빈 공백
    const params = new URLSearchParams(); //한글, 공백, 특수문자가 들어와도 URL에서 깨지지 않게 변환

    params.set('page', String(page)); //URL에 page=현재 페이지를 넣어라.
    params.set('limit', '5'); //한 페이지에 5개씩 가져와라

    if (search) {
        params.set('search', search); //URL 쿼리 파라미터에 검색어를 넣음
    }

    return fetch(`http://localhost:3000/posts?${params.toString()}`);
}

export async function createPost(title: string, content: string, tagNames: string[] = []) { //게시글 작성 API
    const accessToken = localStorage.getItem('accessToken');

    return fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            title,
            content,
            tagNames,
        }),
    });
}

export async function getPost(id: string) { //백엔드에서 게시글 
// 가져오기
    return fetch(`http://localhost:3000/posts/${id}`);
}

export async function deletePost(id: string) { //삭제 API
    const accessToken = localStorage.getItem('accessToken');

    return fetch(`http://localhost:3000/posts/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

export async function updatePost(id: string, title: string, content: string) { //게시물 수정
    const accessToken = localStorage.getItem('accessToken');

    return fetch(`http://localhost:3000/posts/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            title,
            content,
        }),
    });
}