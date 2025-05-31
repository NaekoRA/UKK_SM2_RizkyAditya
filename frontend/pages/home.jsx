import React, { useEffect, useState } from "react";
import PostCard from "../components/postcard";

const Home = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/posts")
            .then((res) => res.json())
            .then((data) => setPosts(data))
            .catch(console.error);
    }, []);

    return (
        <div className="d-flex" >
            <div>
            </div>
            <div className="container-fluid p-3 overflow-auto">
                {posts.length === 0 ? (
                    <p>Loading posts...</p>
                ) : (
                    posts.map((post) => <PostCard key={post.id} post={post} />)
                )}
            </div>
        </div>
    );
};

export default Home;
