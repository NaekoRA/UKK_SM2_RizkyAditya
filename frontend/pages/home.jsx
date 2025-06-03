import React, { useEffect, useState } from "react";
import PostCard from "../components/postcard";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [sortBy, setSortBy] = useState("newest"); 

    useEffect(() => {
        fetch("http://localhost:5000/api/posts")
            .then((res) => res.json())
            .then((data) => {
                const sortedPosts = sortPosts(data, sortBy);
                setPosts(sortedPosts);
            })
            .catch(console.error);
    }, [sortBy]);

    const sortPosts = (posts, sortMethod) => {

        const postsToSort = [...posts];
        switch (sortMethod) {
            case "newest":
                return postsToSort.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            case "oldest":
                return postsToSort.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            case "top":
                return postsToSort.sort((a, b) => {
                    const aVotes = (a.upvotes || 0) - (a.downvotes || 0);
                    const bVotes = (b.upvotes || 0) - (b.downvotes || 0);
                    return bVotes - aVotes;
                });
            case "down":
                return postsToSort.sort((a, b) => {
                    const aVotes = (a.upvotes || 0) - (a.downvotes || 0);
                    const bVotes = (b.upvotes || 0) - (b.downvotes || 0);
                    return aVotes - bVotes;
                });
            case "populer":
                return postsToSort.sort((a, b) => {
                    const aTotal = (a.upvotes || 0) + (a.downvotes || 0);
                    const bTotal = (b.upvotes || 0) + (b.downvotes || 0);
                    return bTotal - aTotal;
                });
            default:
                return postsToSort;
        }
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    return (
        <div className="d-flex">
            <div className="container-fluid p-3 overflow-auto Full">
                <div className="mb-3">
                    <label htmlFor="sort-select" className="form-label me-2">Sort by:</label>
                    <select 
                        id="sort-select" 
                        className="form-select form-select-sm" 
                        style={{ width: 'auto', display: 'inline-block' }}
                        value={sortBy}
                        onChange={handleSortChange}
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest </option>
                        <option value="top">Top Voted</option>
                        <option value="down">Down Voted</option>
                        <option value="populer">Most Populer</option>
                    </select>
                </div>
                
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