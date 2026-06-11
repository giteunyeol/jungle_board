import { useEffect, useState } from "react"
import { getMe } from "../api/authApi"
import { createPost, getPosts } from "../api/postApi";
import type { SubmitEventHandler } from "react";

type Post = { //struct랑 유사함.
  id: number;
  title: string;
  content: string;
  tags: {
    id: number;
    name: string;
  }[];
};

export default function HomePage() {

  const [nickname, setNickname] = useState('');
  const [posts, setPosts] = useState<Post[]>([]); //<Post[]>객체가 들어있고 초기값이([]) 빈 배열이다
  const [title, setTitle] = useState(''); //글쓰기 input에 입력한 제목/내용을 React상태로 기억
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState(''); //사용자가 입력한 태그 문자열 저장
  const [search, setSearch] = useState(''); //검색

  //useEffect:컴포넌트가 화면 랜더링 된 후 실행할 코드 등록함수(Hook함수)
  useEffect(() => {
    async function fetchMe() {
      const response = await getMe();

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setNickname(data.nickname); //백엔드에서 받아온 데이터에서 닉네임을 리액트에 저장한다.
    }

    async function fetchPosts() { //게시물 패치해주기
      const response = await getPosts(search);

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setPosts(data.items);
    }

    fetchMe();
    fetchPosts();

  }, [search]); // 검색어 들어올 때마다 게시글목록

  const handleCreatePost: SubmitEventHandler<HTMLFormElement> =  //유저가 글쓰기 제출할 때 실행할 로직
    async (event) => {
      event.preventDefault(); //화면 전체 랜더링 X

      const tagNames = tagInput
        .split(',')
        .map((tag) => tag.trim()) //trim: 문자열 앞뒤 공백 제거 함수
        .filter((tag) => tag.length > 0);

      const response = await createPost(title, content, tagNames); //만들고 받아온 응답 

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setPosts([data, ...posts]); //방금 백엔드에서 만들어진 새 게시글 data를 기존 게시글 목록 앞에 추가
      setTitle(''); //게시글 만들고 입력창비우기
      setContent(''); // //게시글 만들고 입력창비우기
      setTagInput('');
    }

  //return안: 실제로 브라우저에 그릴 화면 구조.
  //jsx는 저장하는 느낌보다는 화면 변경 "요청"에 가까움
  return (
    <main>
      <h1>게시판</h1>

      {nickname && <p>{nickname}님 로그인 중</p>}

      {nickname && (<button type="button" onClick={() => { localStorage.removeItem('accessToken'); setNickname(''); }}> {/*토큰 지우고 닉네임 비워줌*/}
        로그아웃
      </button>
      )}

      {/* 글쓰기폼 */}
      {/* placeholder:비어있을 때 보여줄 문구 */}
      {nickname && (
        <form onSubmit={handleCreatePost}>
          <h2>글쓰기</h2>

          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="제목"
          />

          <input
            type="text"
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            placeholder="태그를 입력하세요"
          />

          <br />

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="내용"
          />
          <br />
          <button type="submit">작성</button>
        </form>
      )}

      {!nickname && (
        <div>
          <a href="/login">로그인</a>
          <br />
          <a href="/register">회원가입</a>
        </div>)
      }

      <section> {/*section: 내용을 의미 있는 구역으로 묶는 태그*/}
        <h2>게시글 목록</h2>
        
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="게시글 검색"
        />

        {/* article: 독립적인 글/콘텐츠 하나를 나타내는 태그*/}
        {/* key: 리액트가 각 항목을 구분하려고 쓰는 고유값. 리액트 렌더링 최적화/구분용 */}
        {posts.map((post) => (
          <article key={post.id}>
            <h3>
              <a href={`/posts/${post.id}`}>{post.title}</a>
              <span>
                  {post.tags?.map((tag) => (
                    <span key={tag.id}> #{tag.name}</span>
                  ))}
              </span>
            </h3>

            <p>{post.content}</p>

          </article>)
        )}
      </section>
    </main>
  )
}
