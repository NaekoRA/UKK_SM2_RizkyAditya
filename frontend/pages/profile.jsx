import React, { useEffect, useState, useRef } from "react";


const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [bio, setBio] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [editPostId, setEditPostId] = useState(null);
    const [edittexts, setEdittexts] = useState("");
    const fileInputRef = useRef();
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    const fetchUser = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Gagal ambil data user");
            const data = await res.json();
            setUser(data);
            setBio(data.bio || "");
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPosts = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/posts/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Gagal ambil postingan");
            const data = await res.json();
            const posts = Array.isArray(data) ? data : [data];
            setPosts(posts);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (userId && token) {
            fetchUser();
            fetchPosts();
        }
    }, [userId, token]);

    const openModal = () => {
        setBio(user?.bio || "");
        setAvatarFile(null);
        setIsModalOpen(true);
        if (fileInputRef.current) fileInputRef.current.value = null;
    };
    const closeModal = () => setIsModalOpen(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) return alert("User ID tidak ditemukan");

        const formData = new FormData();
        formData.append("bio", bio);
        if (avatarFile) formData.append("avatar", avatarFile);

        try {
            const res = await fetch(`http://localhost:5000/api/users/update`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) throw new Error("Gagal update profile");
            const result = await res.json();
            alert(result.message);
            fetchUser();
            setAvatarFile(null);
            if (fileInputRef.current) fileInputRef.current.value = null;
            closeModal();
        } catch (error) {
            console.error(error);
            alert("Update profil gagal");
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Yakin ingin menghapus postingan ini?")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Gagal hapus postingan");
            alert("Postingan berhasil dihapus");
            fetchPosts();
        } catch (error) {
            console.error(error);
            alert("Hapus postingan gagal");
        }
    };

    const startEditPost = (post) => {
        setEditPostId(post.id);
        setEdittexts(post.texts);
    };

    const cancelEditPost = () => {
        setEditPostId(null);
        setEdittexts("");
    };

    const handleEditPostSubmit = async (postId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ texts: edittexts }),
            });
            if (!res.ok) throw new Error("Gagal update postingan");
            alert("Postingan berhasil diupdate");
            setEditPostId(null);
            setEdittexts("");
            fetchPosts();
        } catch (error) {
            console.error(error);
            alert("Update postingan gagal");
        }
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div className="container mt-4 Full">
            <h2>Profile Saya</h2>

            <div className="mb-3">
                <img
                    src={
                        user.avatar
                            ? `http://localhost:5000/uploads/img/${user.avatar}`
                            : "/images.png"
                    }
                    alt="avatar"
                    style={{ width: 150, height: 150, borderRadius: "50%", objectFit: "cover" }}
                />
            </div>

            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Bio:</strong> {user.bio || "-"}</p>

            <button className="btn btn-primary mb-4" onClick={openModal}>
                Edit Profile
            </button>

            <h3>Postingan Saya</h3>
            {posts.length === 0 && <p>Belum ada postingan.</p>}
            <div>
                {posts.map((post) => (
                    <div key={post.id} className="card mb-3">
                        <div className="card-body">
                            {editPostId === post.id ? (
                                <>
                                    <textarea
                                        className="form-control mb-2"
                                        value={edittexts}
                                        onChange={(e) => setEdittexts(e.target.value)}
                                        rows={3}
                                    />
                                    <button
                                        className="btn btn-success me-2"
                                        onClick={() => handleEditPostSubmit(post.id)}
                                    >
                                        Simpan
                                    </button>
                                    <button className="btn btn-secondary" onClick={cancelEditPost}>
                                        Batal
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p>{post.texts}</p>
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => startEditPost(post)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDeletePost(post.id)}
                                    >
                                        Hapus
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Edit Profile */}
            {isModalOpen && (
                <div
                    className="modal fade show"
                    style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
                    tabIndex="-1"
                    role="dialog"
                    aria-modal="true"
                    onClick={closeModal}
                >
                    <div
                        className="modal-dialog"
                        role="document"
                        onClick={(e) => e.stopPropagation()}
                        style={{ maxWidth: "500px" }}
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Profile</h5>
                                <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="bio" className="form-label">Bio</label>
                                        <textarea
                                            id="bio"
                                            className="form-control"
                                            rows="3"
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="avatar" className="form-label">Ganti Avatar (opsional)</label>
                                        <input
                                            type="file"
                                            id="avatar"
                                            accept="image/*"
                                            className="form-control"
                                            ref={fileInputRef}
                                            onChange={(e) => setAvatarFile(e.target.files[0])}
                                        />
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                        Batal
                                    </button>
                                    <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
