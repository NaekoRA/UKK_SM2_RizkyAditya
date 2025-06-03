import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CreatePostModal = ({ show, onClose, onPostCreated, onRefresh }) => {
    const [texts, settexts] = useState("");
    const [mediaFile, setMediaFile] = useState(null);

    const token = localStorage.getItem("token");

    if (!show) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("texts", texts);
            if (mediaFile) formData.append("media", mediaFile);

            const res = await fetch("http://localhost:5000/api/posts", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (res.ok) {
                const newPost = await res.json();
                Swal.fire({
                    title: "Success!",
                    text: "Post berhasil dibuat!",
                    icon: "success"
                });
                onPostCreated(newPost);
                settexts("");
                setMediaFile(null);
                onClose();
                onRefresh(); // Panggil fungsi refresh setelah post berhasil
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Gagal membuat post",
                    icon: "error"
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error!",
                text: "Error saat membuat post",
                icon: "error"
            });
        }
    };

    return (
        <div
            className="modal show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
            tabIndex="-1"
            onClick={onClose}
        >
            <div
                className="modal-dialog"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create Post</h5>
                        <button type="button" className="btn-close" onClick={onClose} />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <textarea
                                className="form-control mb-3"
                                placeholder="Apa yang sedang Anda pikirkan?"
                                value={texts}
                                onChange={(e) => settexts(e.target.value)}
                                required
                                rows={5}
                            />
                            <div className="mb-3">
                                <label htmlFor="mediaUpload" className="form-label">Upload Gambar/Video</label>
                                <input
                                    id="mediaUpload"
                                    type="file"
                                    accept="image/*,video/*"
                                    className="form-control"
                                    onChange={(e) => setMediaFile(e.target.files[0])}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Batal
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Posting
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const Sidebar = () => {
    const navigate = useNavigate();
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const role = localStorage.getItem("role");
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("role");
        navigate("/login");
    };

    const handleOpenCreatePost = () => setShowCreatePost(true);
    const handleCloseCreatePost = () => setShowCreatePost(false);

    const handlePostCreated = (newPost) => {
        console.log("Post baru dibuat:", newPost);
    };

    const handleRefresh = () => {
        // Pilihan 1: Refresh halaman sepenuhnya (sederhana)
        // window.location.reload();

        // Pilihan 2: Force re-render Outlet component (lebih baik)
        setRefreshKey(prevKey => prevKey + 1);
    };

    return (
        <div className="d-flex vh-100">
            <div
                className="d-flex flex-column p-3 text-white bg-dark"
                style={{ width: "250px" }}
            >
                <a
                    href="/"
                    className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
                >
                    <span className="fs-4">Menu</span>
                </a>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                "nav-link text-white" + (isActive ? " active" : "")
                            }
                            end
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/profile"
                            className={({ isActive }) =>
                                "nav-link text-white" + (isActive ? " active" : "")
                            }
                        >
                            Profile
                        </NavLink>
                    </li>
                    {role === "admin" && (
                        <li>
                            <NavLink
                                to="/admin"
                                className={({ isActive }) =>
                                    "nav-link text-white" + (isActive ? " active" : "")
                                }
                            >
                                Admin Page
                            </NavLink>
                        </li>
                    )}
                    <li>
                        <button
                            onClick={handleOpenCreatePost}
                            className="nav-link text-white btn btn-link text-start p-0"
                            style={{ width: "100%" }}
                        >
                            <i className="bi bi-plus-circle me-2"></i>
                            &nbsp;&nbsp;Create Post <br />
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={handleLogout}
                            className="nav-link text-white btn btn-link text-start p-0"
                            style={{ width: "100%" }}
                        >
                            <i className="bi bi-box-arrow-left me-2"></i>
                            &nbsp;&nbsp;Logout
                        </button>
                    </li>
                </ul>
            </div>

            <div
                className="flex-grow-1 p-3"
                style={{ overflowY: "auto", height: "100vh" }}
            >
                <Outlet key={refreshKey} />
            </div>

            <CreatePostModal
                show={showCreatePost}
                onClose={handleCloseCreatePost}
                onPostCreated={handlePostCreated}
                onRefresh={handleRefresh}
            />
        </div>
    );
};

export default Sidebar;