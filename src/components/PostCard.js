import { Card, Button, Form, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function PostCard({ post, onPostUpdate }) {
    const [postData, setPostData] = useState(post);
    const { _id, title, content, author, createdAt } = postData;
    const [postComments, setPostComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isPostDeleted, setIsPostDeleted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedContent, setEditedContent] = useState(content);
    const [isAddingComment, setIsAddingComment] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.user) {
                        setLoggedInUserId(data.user._id);
                        setIsAdmin(data.user.isAdmin);
                        setLoggedInUser(data.user);
                    }
                });
        }

        fetch(`${process.env.REACT_APP_API_URL}/comments/post/${_id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.comments) {
                    setPostComments(data.comments);
                }
            })
            .catch(err => console.error('Error fetching comments:', err));
    }, [_id]);

    const handleAddComment = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "Authentication Required",
                text: "You need to be logged in to add a comment."
            });
            return;
        }

        setIsAddingComment(true);

        fetch(`${process.env.REACT_APP_API_URL}/comments`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ postId: _id, comment: newComment })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    Swal.fire({
                        icon: "error",
                        title: "Failed to Add Comment",
                        text: data.message
                    });
                } else {
                    const newCommentObj = {
                        _id: data.comment._id,
                        comment: data.comment.comment,
                        userId: {
                            _id: loggedInUser._id,
                            username: loggedInUser.username
                        },
                        createdAt: data.comment.createdAt,
                        postId: _id
                    };
                    setPostComments(prevComments => [...prevComments, newCommentObj]);
                    setNewComment("");
                    Swal.fire({
                        icon: "success",
                        title: "Comment Added"
                    });
                }
            })
            .catch(err => {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Something went wrong while adding your comment."
                });
                console.error('Error adding comment:', err);
            })
            .finally(() => {
                setIsAddingComment(false);
            });
    };

    const handleDeletePost = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "Authentication Required",
                text: "You need to be logged in to delete a post."
            });
            return;
        }

        if (loggedInUserId !== author._id && !isAdmin) {
            Swal.fire({
                icon: "error",
                title: "Permission Denied",
                text: "You can only delete your own posts or you must be an admin."
            });
            return;
        }

        fetch(`${process.env.REACT_APP_API_URL}/posts/${_id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    Swal.fire({
                        icon: "error",
                        title: "Unsuccessful Post Deletion",
                        text: data.message
                    });
                } else {
                    setIsPostDeleted(true);
                    Swal.fire({
                        icon: "success",
                        title: "Post Deleted"
                    });
                }
            });
    };

    const handleEditPost = () => {
        setIsEditing(true);
        setEditedTitle(postData.title);
        setEditedContent(postData.content);
    };

    const handleSaveEdit = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "Authentication Required",
                text: "You need to be logged in to edit a post."
            });
            return;
        }

        fetch(`${process.env.REACT_APP_API_URL}/posts/${_id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title: editedTitle, content: editedContent })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    Swal.fire({
                        icon: "error",
                        title: "Failed to Update Post",
                        text: data.message
                    });
                } else {
                    const updatedPost = {
                        ...postData,
                        title: editedTitle,
                        content: editedContent
                    };
                    setPostData(updatedPost);
                    setIsEditing(false);
                    
                    if (onPostUpdate) {
                        onPostUpdate(updatedPost);
                    }
                    
                    Swal.fire({
                        icon: "success",
                        title: "Post Updated"
                    });
                }
            })
            .catch(err => console.error("Error updating post:", err));
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedTitle(postData.title);
        setEditedContent(postData.content);
    };

    const handleDeleteComment = (commentId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "Authentication Required",
                text: "You need to be logged in to delete a comment."
            });
            return;
        }

        const commentOwnerId = postComments.find(comment => comment._id === commentId)?.userId._id;

        if (loggedInUserId !== commentOwnerId && !isAdmin) {
            Swal.fire({
                icon: "error",
                title: "Permission Denied",
                text: "You can only delete your own comments or you must be an admin."
            });
            return;
        }

        fetch(`${process.env.REACT_APP_API_URL}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    Swal.fire({
                        icon: "error",
                        title: "Failed to Delete Comment",
                        text: data.message
                    });
                } else {
                    setPostComments(postComments.filter(comment => comment._id !== commentId));
                    Swal.fire({
                        icon: "success",
                        title: "Comment Deleted"
                    });
                }
            })
            .catch(err => console.error("Error deleting comment:", err));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isPostDeleted) {
        return (
            <Card className="bg-light text-center mt-3">
                <Card.Body>Post deleted successfully.</Card.Body>
            </Card>
        );
    }

    return (
        <Card className="mt-3 shadow">
            <Card.Header className="bg-white">
                {isEditing ? (
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                placeholder="Post title"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                placeholder="Post content"
                            />
                        </Form.Group>
                        <div className="d-flex gap-2">
                            <Button variant="primary" onClick={handleSaveEdit}>Save</Button>
                            <Button variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
                        </div>
                    </Form>
                ) : (
                    <>
                        <Card.Title className="h4 mb-2">{postData.title}</Card.Title>
                        <div className="text-muted small mb-2">
                            Posted by {author.username} • {formatDate(createdAt)}
                        </div>
                    </>
                )}
            </Card.Header>

            <Card.Body>
                {!isEditing && (
                    <Card.Text className="mb-4">{postData.content}</Card.Text>
                )}

                <hr className="my-4" />

                <h5 className="mb-3">Comments</h5>
                <div className="mb-4">
                    {postComments.map(comment => (
                        <Card key={comment._id} className="mb-3 bg-light">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <div className="d-flex align-items-center gap-2">
                                            <strong>{comment.userId.username}</strong>
                                            <small className="text-muted">
                                                • {formatDate(comment.createdAt)}
                                            </small>
                                        </div>
                                        <p className="mt-2 mb-0">{comment.comment}</p>
                                    </div>
                                    {(comment.userId._id === loggedInUserId || isAdmin) && (
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm"
                                            onClick={() => handleDeleteComment(comment._id)}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>

                {loggedInUserId && (
                    <Form className="mt-4">
                        <Form.Group className="mb-3">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            onClick={handleAddComment}
                            disabled={isAddingComment}
                        >
                            {isAddingComment ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Adding Comment...
                                </>
                            ) : (
                                'Add Comment'
                            )}
                        </Button>
                    </Form>
                )}
            </Card.Body>

            {(loggedInUserId === author._id || isAdmin) && (
                <Card.Footer className="bg-white d-flex justify-content-end gap-2">
                    {loggedInUserId === author._id && (
                        <Button variant="warning" onClick={handleEditPost}>Edit Post</Button>
                    )}
                    <Button variant="danger" onClick={handleDeletePost}>Delete Post</Button>
                </Card.Footer>
            )}
        </Card>
    );
}