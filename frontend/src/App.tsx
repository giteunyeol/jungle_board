import './App.css'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PostDetailPage from './pages/PostDetailPage'; //상세페이지
import { Route,Routes } from 'react-router'

function App() { //React 컴포넌트, App에 화면 구성이 어떻게 될지

  return (
    <> {/*리액트 문법, 리액트 내부에서 묶어만 주는 용도, 라우터가 해당 경로의 URL과 맞는 루트를 찾아 해당 루트의 element컴포넌트를 랜더링한다*/}
    <Routes> 
      <Route path='/' element={<HomePage/>}/> 
      <Route path='/about' element={<AboutPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/posts/:id' element={<PostDetailPage />} /> 
    </Routes>
    </>
  )
}

export default App //App컴포넌트를 다른곳에서 꺼내 쓸 수 있게함
