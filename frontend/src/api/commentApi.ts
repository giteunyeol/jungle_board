export async function getComments(postId: string) { //댓글 얻어오기
    return fetch(`http://localhost:3000/comments/posts/${postId}`);
}

export async function createComment(postId: string, content: string) { //댓글 생성
    const accessToken = localStorage.getItem('accessToken');

    return fetch(`http://localhost:3000/comments/posts/${postId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            content,
        }),
    });
}

export async function deleteComment(id: number) { //댓글 삭제
    const accessToken = localStorage.getItem('accessToken');

    return fetch(`http://localhost:3000/comments/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}