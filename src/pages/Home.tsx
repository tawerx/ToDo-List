import React from 'react';
import Header from '../components/Header';
import Post from '../components/Post';
import EmptyPosts from '../components/EmptyPosts';
import { useSelector, useDispatch } from 'react-redux';
import { setPosts } from '../redux/slices/logic';
import { RootState } from '../redux/store';

const Home: React.FC = () => {
  const dispath = useDispatch();
  const { flag, posts } = useSelector((state: RootState) => state.logic);

  React.useEffect(() => {
    if (localStorage.getItem('posts') == null) {
      localStorage.setItem('posts', '[]');
    }

    if (localStorage.getItem('colors') == null) {
      localStorage.setItem('colors', '{}');
    }
  }, []);

  React.useEffect(() => {
    dispath(setPosts(JSON.parse(localStorage.getItem('posts') as string)));
  }, [flag]);

  const emptyPostRef = React.useRef(null);

  const emptyPosts = <EmptyPosts />;
  const postsItems = posts.map((obj, i) => {
    return <Post key={obj.title} {...obj} index={i} />;
  });

  return (
    <div className="wrapper">
      <Header />
      <div className="container">{posts[0] == undefined ? emptyPosts : postsItems}</div>
    </div>
  );
};

export default Home;
