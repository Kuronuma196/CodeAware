
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { lumi } from '../lib/lumi'
import {Eye, Heart, Clock, User, Tag, ArrowLeft, Share2, MessageCircleDashed as MessageCircle} from 'lucide-react'
import toast from 'react-hot-toast'

interface Post {
  _id: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
  authorEmail: string
  status: string
  featured: boolean
  imageUrl?: string
  readTime: number
  views: number
  likes: number
  createdAt: string
  publishedAt?: string
}

interface Comment {
  _id: string
  postId: string
  content: string
  author: string
  authorEmail: string
  status: string
  likes: number
  createdAt: string
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [newComment, setNewComment] = useState({
    content: '',
    author: '',
    authorEmail: ''
  })

  const categoryColors = {
    programacao: 'bg-blue-100 text-blue-800',
    ciberseguranca: 'bg-red-100 text-red-800',
    campanhas: 'bg-green-100 text-green-800',
    noticias: 'bg-purple-100 text-purple-800',
    leis: 'bg-yellow-100 text-yellow-800',
    cibercrimes: 'bg-orange-100 text-orange-800'
  }

  const categoryNames = {
    programacao: 'Programação',
    ciberseguranca: 'Cibersegurança',
    campanhas: 'Campanhas',
    noticias: 'Notícias',
    leis: 'Legislação',
    cibercrimes: 'Crimes Digitais'
  }

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return

      try {
        setLoading(true)
        
        // Buscar post
        const fetchedPost = await lumi.entities.posts.get(id)
        setPost(fetchedPost)

        // Incrementar visualizações
        await lumi.entities.posts.update(id, {
          views: (fetchedPost.views || 0) + 1
        })

        // Buscar comentários aprovados
        const commentsResponse = await lumi.entities.comments.list({
          filter: { postId: id, status: 'approved' },
          sort: { createdAt: -1 }
        })
        setComments(commentsResponse.list || [])

      } catch (error) {
        console.error('Erro ao carregar post:', error)
        toast.error('Erro ao carregar post')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const handleLike = async () => {
    if (!post) return

    try {
      const newLikes = liked ? post.likes - 1 : post.likes + 1
      await lumi.entities.posts.update(post._id, { likes: newLikes })
      setPost({ ...post, likes: newLikes })
      setLiked(!liked)
      toast.success(liked ? 'Like removido' : 'Post curtido!')
    } catch (error) {
      console.error('Erro ao curtir post:', error)
      toast.error('Erro ao curtir post')
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Link copiado para a área de transferência!')
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.content || !newComment.author || !newComment.authorEmail) {
      toast.error('Preencha todos os campos do comentário')
      return
    }

    try {
      const commentData = {
        postId: post?._id || '',
        content: newComment.content,
        author: newComment.author,
        authorEmail: newComment.authorEmail,
        status: 'pending',
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await lumi.entities.comments.create(commentData)
      
      setNewComment({ content: '', author: '', authorEmail: '' })
      toast.success('Comentário enviado para moderação!')
    } catch (error) {
      console.error('Erro ao criar comentário:', error)
      toast.error('Erro ao enviar comentário')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post não encontrado</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Voltar ao início
          </Link>
        </div>
      </div>
    )
  }

  const timeAgo = formatDistanceToNow(new Date(post.publishedAt || post.createdAt), {
    addSuffix: true,
    locale: ptBR
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao blog</span>
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[post.category as keyof typeof categoryColors]}`}>
              {categoryNames[post.category as keyof typeof categoryNames]}
            </span>
            {post.featured && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Destaque
              </span>
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min de leitura</span>
              </div>
              <span>{timeAgo}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-gray-500">
                <Eye className="w-4 h-4" />
                <span>{post.views}</span>
              </div>
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                  liked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                <span>{post.likes}</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Compartilhar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
          )}
          
          <div className="p-8">
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center space-x-2 mt-8 pt-6 border-t border-gray-200">
                <Tag className="w-4 h-4 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <MessageCircle className="w-6 h-6" />
            <span>Comentários ({comments.length})</span>
          </h2>
          
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Deixe seu comentário</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Seu nome"
                value={newComment.author}
                onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                type="email"
                placeholder="Seu email"
                value={newComment.authorEmail}
                onChange={(e) => setNewComment({ ...newComment, authorEmail: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <textarea
              placeholder="Escreva seu comentário..."
              value={newComment.content}
              onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
              required
            />
            
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enviar Comentário
            </button>
          </form>
          
          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Seja o primeiro a comentar neste post!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {comment.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{comment.author}</p>
                        <p className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed ml-11">
                    {comment.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default PostDetail
