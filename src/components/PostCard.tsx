
import React from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {Eye, Heart, Clock, User, Star} from 'lucide-react'

interface Post {
  _id: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
  status: string
  featured: boolean
  imageUrl?: string
  readTime: number
  views: number
  likes: number
  createdAt: string
  publishedAt?: string
}

interface PostCardProps {
  post: Post
  featured?: boolean
}

const PostCard: React.FC<PostCardProps> = ({ post, featured = false }) => {
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

  const timeAgo = formatDistanceToNow(new Date(post.publishedAt || post.createdAt), {
    addSuffix: true,
    locale: ptBR
  })

  return (
    <article className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group ${
      featured ? 'md:flex' : ''
    }`}>
      {/* Imagem */}
      <div className={`relative overflow-hidden ${
        featured ? 'md:w-2/3' : 'w-full'
      }`}>
        <Link to={`/post/${post._id}`}>
          <img
            src={post.imageUrl || 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg'}
            alt={post.title}
            className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              featured ? 'h-64 md:h-full' : 'h-48'
            }`}
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            categoryColors[post.category as keyof typeof categoryColors]
          }`}>
            {categoryNames[post.category as keyof typeof categoryNames]}
          </span>
          {post.featured && (
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Star className="w-3 h-3" />
              <span>Destaque</span>
            </span>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className={`p-6 ${featured ? 'md:w-1/3 flex flex-col justify-between' : ''}`}>
        <div>
          <Link to={`/post/${post._id}`}>
            <h2 className={`font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3 line-clamp-2 ${
              featured ? 'text-2xl' : 'text-xl'
            }`}>
              {post.title}
            </h2>
          </Link>
          
          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-gray-400 text-xs">
                  +{post.tags.length - 3} mais
                </span>
              )}
            </div>
          )}
        </div>

        {/* Metadados */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} min</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{post.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{post.likes}</span>
            </div>
          </div>
        </div>

        <div className="mt-2 text-xs text-gray-400">
          {timeAgo}
        </div>
      </div>
    </article>
  )
}

export default PostCard
