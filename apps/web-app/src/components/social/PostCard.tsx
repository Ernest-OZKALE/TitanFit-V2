import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2, Send, Dumbbell, Utensils, Trophy, Zap, AlertTriangle } from 'lucide-react';
import { type SocialPost, SocialAPI } from '@/lib/api/social';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Link from 'next/link';

interface PostProps {
    post: SocialPost;
    onDelete: (id: string) => void;
    currentUserId?: string | null;
}

export default function PostCard({ post, onDelete, currentUserId }: PostProps) {
    const [liked, setLiked] = useState(false); // Optimistic
    const [likeCount, setLikeCount] = useState(post.likes_count || 0);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [comments, setComments] = useState<any[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [commentCount, setCommentCount] = useState(post.comments_count || 0);

    // Dialog States
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

    // Like Handler
    const handleLike = async () => {
        if (liked) return; // Prevent spam for now or implement unlike
        setLiked(true);
        setLikeCount(prev => prev + 1);
        try {
            await SocialAPI.toggleLike(post.id);
        } catch (error) {
            setLiked(false);
            setLikeCount(prev => prev - 1);
            toast.error("Impossible d'aimer ce post");
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(`${window.location.origin}/social/${post.id}`);
        toast.success("Lien copié !");
    };

    const handleDeletePost = async () => {
        try {
            await SocialAPI.deletePost(post.id);
            onDelete(post.id); // Update parent state
            setIsDeleteDialogOpen(false);
        } catch (error: any) {
            console.error("Delete Error:", error);
            const msg = error.message.message || error.message || "Erreur inconnue";
            toast.error(`Impossible de supprimer: ${msg}`);
        }
    };

    const toggleComments = async () => {
        setIsCommentsOpen(!isCommentsOpen);
        if (!isCommentsOpen && comments.length === 0) {
            setLoadingComments(true);
            try {
                const data = await SocialAPI.getComments(post.id);
                setComments(data);
            } catch (error) {
                console.error("Fetch comments error:", error);
            } finally {
                setLoadingComments(false);
            }
        }
    };

    const handleSendComment = async () => {
        if (!newComment.trim()) return;
        try {
            const addedComment = await SocialAPI.addComment(post.id, newComment);

            // Optimistic Update
            const optimisticComment = {
                ...addedComment,
                user: {
                    username: 'Moi',
                    avatar_url: null
                }
            };

            setComments(prev => [...prev, optimisticComment]);
            setNewComment('');
            setCommentCount(prev => prev + 1);
            toast.success("Commentaire envoyé");
        } catch (error: any) {
            console.error('Full Comment Error:', JSON.stringify(error, null, 2));
            const msg = error.message || error.error_description || "Erreur inconnue";
            toast.error(`Erreur (${error.code || 'N/A'}): ${msg}`);
        }
    };

    // Trigger Dialog
    const handleDeleteCommentClick = (commentId: string) => {
        setCommentToDelete(commentId);
    };

    // Actual Delete Logic
    const confirmDeleteComment = async () => {
        if (!commentToDelete) return;
        try {
            await SocialAPI.deleteComment(commentToDelete);
            setComments(prev => prev.filter(c => c.id !== commentToDelete));
            setCommentCount(prev => prev - 1);
            toast.success("Commentaire supprimé");
        } catch (error: any) {
            toast.error("Suppression impossible");
        } finally {
            setCommentToDelete(null);
        }
    };

    const getIcon = () => {
        switch (post.type) {
            case 'workout': return <Dumbbell className="w-3 h-3 text-[#D4AF37]" />;
            case 'meal': return <Utensils className="w-3 h-3 text-emerald-400" />;
            case 'achievement': return <Trophy className="w-3 h-3 text-yellow-400" />;
            default: return <Zap className="w-3 h-3 text-blue-400" />;
        }
    };

    const timeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diffInSeconds < 60) return "À l'instant";
        if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
        if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
        return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;
    };

    const isOwner = currentUserId === post.user_id;

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-[#0F0F0F]/80 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden hover:border-[#D4AF37]/30 transition-all duration-300 group"
            >
                {/* Header */}
                <div className="p-4 flex justify-between items-start">
                    <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/10 overflow-hidden">
                                {post.user.avatar_url ? (
                                    <Image src={post.user.avatar_url} alt={post.user.username} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500 uppercase">
                                        {post.user.username?.charAt(0) || 'T'}
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#1A1A1A] border border-white/10">
                                {getIcon()}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-200 group-hover:text-[#D4AF37] transition-colors">
                                {post.user.username || 'Titan'}
                            </h3>
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                                {post.user.level || 'Novice'} • {timeAgo(post.created_at)}
                            </p>
                        </div>
                    </Link>

                    {isOwner ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="text-gray-500 hover:text-white transition-colors p-1">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-white/10 text-gray-200">
                                <DropdownMenuItem
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        setIsDeleteDialogOpen(true);
                                    }}
                                    className="text-red-500 focus:text-red-400 focus:bg-white/5 cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Supprimer
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <button className="text-gray-500/50 cursor-default">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="px-4 pb-2">
                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                    </p>
                </div>

                {/* Image Attachment */}
                {post.image_url && (
                    <div className="mt-2 relative w-full aspect-video bg-black/50">
                        <Image
                            src={post.image_url}
                            alt="Post content"
                            fill
                            className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                    </div>
                )}

                {/* Workout Stats */}
                {post.type === 'workout' && post.metadata && (
                    <div className="px-4 py-2 mt-2 flex gap-2 overflow-x-auto no-scrollbar">
                        {post.metadata.stats?.map((stat: any, i: number) => (
                            <div key={i} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                {stat.label}: <span className="text-white">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="p-4 flex items-center justify-between border-t border-white/5 mt-2">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={handleLike}
                            className={cn(
                                "flex items-center gap-2 text-xs font-bold transition-all hover:scale-110",
                                liked ? "text-red-500" : "text-gray-500 hover:text-red-400"
                            )}
                        >
                            <Heart className={cn("w-5 h-5", liked && "fill-current")} />
                            <span>{likeCount}</span>
                        </button>

                        <button
                            onClick={toggleComments}
                            className={cn(
                                "flex items-center gap-2 text-xs font-bold transition-all hover:scale-110",
                                isCommentsOpen ? "text-[#D4AF37]" : "text-gray-500 hover:text-blue-400"
                            )}
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span>{commentCount}</span>
                        </button>
                    </div>

                    <button onClick={handleShare} className="text-gray-500 hover:text-white transition-colors hover:scale-110">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                    {isCommentsOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-black/20 border-t border-white/5 overflow-hidden"
                        >
                            <div className="p-4 space-y-4">
                                {/* List */}
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {loadingComments ? (
                                        <p className="text-xs text-center text-gray-500 animate-pulse">Chargement...</p>
                                    ) : comments.length === 0 ? (
                                        <p className="text-xs text-center text-gray-500">Aucun commentaire.</p>
                                    ) : (
                                        comments.map((comment, index) => (
                                            <div key={comment.id || index} className="flex gap-2 group/comment">
                                                <div className="w-6 h-6 rounded-full bg-[#1A1A1A] flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-500 border border-white/10 uppercase">
                                                    {comment.user?.username?.charAt(0) || '?'}
                                                </div>
                                                <div className="bg-white/5 rounded-r-xl rounded-bl-xl p-2 flex-1 text-xs text-gray-300 relative">
                                                    <div className="flex justify-between items-baseline mb-1">
                                                        <span className="font-bold text-gray-200">{comment.user?.username || 'Utilisateur'}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[9px] text-gray-600">{timeAgo(comment.created_at || new Date().toISOString())}</span>
                                                            {currentUserId === comment.user_id && (
                                                                <button
                                                                    onClick={() => handleDeleteCommentClick(comment.id)}
                                                                    className="text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover/comment:opacity-100"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {comment.content}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Input */}
                                <div className="flex gap-2 items-center pt-2">
                                    <input
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Écrire un commentaire..."
                                        className="flex-1 bg-black/40 border border-white/10 rounded-full h-8 px-4 text-xs text-white focus:outline-none focus:border-[#D4AF37]/50 placeholder:text-gray-600"
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                                    />
                                    <button
                                        onClick={handleSendComment}
                                        disabled={!newComment.trim()}
                                        className="p-2 rounded-full bg-[#D4AF37] text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#b8952b] transition-colors"
                                    >
                                        <Send className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* DELETE POST DIALOG */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-[#1A1A1A] border-white/10 text-white sm:rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            Confirmer la suppression
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Cette action est irréversible. Ce post disparaitra du Nexus.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="ghost"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="text-gray-400 hover:text-white hover:bg-white/5"
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeletePost}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            Supprimer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* DELETE COMMENT DIALOG */}
            <Dialog open={!!commentToDelete} onOpenChange={(open) => !open && setCommentToDelete(null)}>
                <DialogContent className="bg-[#1A1A1A] border-white/10 text-white sm:rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            Effacer le commentaire ?
                        </DialogTitle>
                        <DialogDescription className="text-gray-400 text-xs">
                            Cette action est définitive.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCommentToDelete(null)}
                            className="text-gray-400 hover:text-white hover:bg-white/5"
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={confirmDeleteComment}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            Confirmer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
