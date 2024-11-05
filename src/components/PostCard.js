import { Card, Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function PostCard({ post }) {
    const { _id, title, content, author } = post;
    const [postComments, setPostComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

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
                }
            });
        }

        fetch(`${process.env.REACT_APP_API_URL}/post/${_id}`, {
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
                setPostComments([...postComments, data.comment]);
                setNewComment("");
                Swal.fire({
                    icon: "success",
                    title: "Comment Added"
                });
            }
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
                Swal.fire({
                    icon: "success",
                    title: "Post Deleted"
                });
                window.location.reload();
            }
        });
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
        });
    };

    return (
        <Card className="mt-3">
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Subtitle>Author: {author.username}</Card.Subtitle>
                <Card.Text>{content}</Card.Text>
                <Card.Subtitle>Comments:</Card.Subtitle>
                {postComments.map(comment => (
                    <Card.Text key={comment._id}>
                        <strong>{comment.userId.username}:</strong> {comment.comment}
                        {(comment.userId._id === loggedInUserId || isAdmin) && (
                            <Button variant="danger" size="sm" onClick={() => handleDeleteComment(comment._id)}>Delete</Button>
                        )}
                    </Card.Text>
                ))}
                {loggedInUserId && (
                    <Form.Group className="mt-3">
                        <Form.Control 
                            type="text" 
                            placeholder="Add a comment" 
                            value={newComment} 
                            onChange={(e) => setNewComment(e.target.value)} 
                        />
                        <Button variant="primary" onClick={handleAddComment} className="mt-2">Submit Comment</Button>
                    </Form.Group>
                )}
            </Card.Body>
            <Card.Footer className="d-flex justify-content-around">
                {(loggedInUserId === author._id || isAdmin) && (
                    <Button variant="danger" onClick={handleDeletePost}>Delete Post</Button>
                )}
            </Card.Footer>
        </Card>
    );
}
