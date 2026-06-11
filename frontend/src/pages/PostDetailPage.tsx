import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { deletePost, getPost, updatePost } from "../api/postApi"; 

type Post = {
    id: number;
    title: string;
    content: string;
};

export default function PostDetailPage() { //상세페이지 파일 생성
    const params = useParams(); //리액트 라우터가 주는 훅 함수, URL에서 ID같은 가변값을 가져옴.
    const postId = params.id; //게시글 고유번호
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null); //처음에 널로 주고 백엔드에서 가져오면 포스트 객체로 채움

    //글 수정할때 필요
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    
    useEffect( () => {
        async function fetchPost() {
            if (!postId) { //만약 게시글 ID가 없으면 그냥 리턴
                return;
            }

            const response = await getPost(postId); //응답 받아오기

            if (!response.ok) {
                return;
            }

            const data = await response.json(); //백엔드에서 받아온 게시글 데이터를 React 상태 post에 저장한다.
            setPost(data); //백엔드에서 받아온 게시글 데이터를 React상태 post에 저장함.
            setEditTitle(data.title); //상세글을 불러오면 수정 인풋 초기값도 현재 제목/내용으로 세팅
            setEditContent(data.content);
        }

        fetchPost();
    }, [postId]); //[postId] : useEffect의 의존성 배열. postId값이 바뀌면 이 effect를 다시 실행해라.

    async function handleDelete() { //실제로 지우는 함수
        if (!postId) {
            return;
        }

        const response = await deletePost(postId);

        if (!response.ok) {
            alert('삭제에 실패했습니다.');
            return;
        }

        const data = await response.json();
        
        setPost(data); //수정 성공 후 백엔드가 돌려준 최신 게시글로 화면을 바꿈
        setIsEditing(false); //수정모드 끄기

    }

    async function handleUpdate() { //수정하는 함수
        if (!postId) {
            return;
        }

        const response = await updatePost(postId, editTitle, editContent);

        if (!response.ok) {
            alert('수정에 실패했습니다.');
            return;
        }

        const data = await response.json();

        setPost(data);
        setIsEditing(false);
    }

    return (
        <main>
            <h1>게시글 상세</h1>

            {!post && <p>불러오는 중...</p>} {/* 로딩이 안됐으면 */}
            { post && (
                <article>
                    {/* 편집중이 아니라면 */}
                    {!isEditing && ( 
                        <>
                            <h2>{post.title}</h2>
                            <p>{post.content}</p>

                            <button type="button" onClick={() => setIsEditing(true)}> 수정 </button>
                            <button type="button" onClick={handleDelete}> 삭제 </button>
                        </>
                    )}
                    {isEditing &&(
                        <>
                            <input type="text" value={editTitle} onChange={(event) => setEditTitle(event.target.value)}/>
                            <textarea value={editContent} onChange={(event) => setEditContent(event.target.value)}/>
                            <button type="button" onClick={handleUpdate}>저장</button>
                            <button type="button" onClick={() => setIsEditing(false)}>취소</button>
                        </>
                    )}
                </article>
            )}
        </main>
    );
}