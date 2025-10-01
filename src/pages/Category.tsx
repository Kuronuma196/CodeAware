
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { lumi } from '../lib/lumi'
import PostCard from '../components/PostCard'
import {Search, Filter, Grid, List, ArrowLeft} from 'lucide-react'
import toast from 'react-hot-toast'

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

const Category: React.FC = () => {
  const { category } = useParams<{ category: string }>()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('publishedAt')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])

  const categoryInfo = {
    programacao: {
      name: 'Programação',
      description: 'Artigos sobre desenvolvimento de software, linguagens de programação e boas práticas',
      color: 'from-blue-500 to-blue-600',
      icon: '💻'
    },
    ciberseguranca: {
      name: 'Cibersegurança',
      description: 'Conteúdo sobre proteção digital, prevenção de ataques e segurança online',
      color: 'from-red-500 to-red-600',
      icon: '🛡️'
    },
    cibercrimes: {
      name: 'Crimes Digitais',
      description: 'Informações sobre crimes cibernéticos, prevenção e conscientização',
      color: 'from-orange-500 to-orange-600',
      icon: '⚠️'
    },
    campanhas: {
      name: 'Campanhas',
      description: 'Campanhas de conscientização e iniciativas da comunidade',
      color: 'from-green-500 to-green-600',
      icon: '📢'
    },
    noticias: {
      name: 'Notícias',
      description: 'Últimas notícias do mundo da tecnologia e segurança digital',
      color: 'from-purple-500 to-purple-600',
      icon: '📰'
    },
    leis: {
      name: 'Legislação',
      description: 'Leis, regulamentações e aspectos legais do mundo digital',
      color: 'from-yellow-500 to-yellow-600',
      icon: '⚖️'
    }
  }

  const currentCategory = category ? categoryInfo[category as keyof typeof categoryInfo] : null

  useEffect(() => {
    const fetchPosts = async () => {
      if (!category) return

      try {
        setLoading(true)
        const response = await lumi.entities.posts.list({
          filter: { 
            status: 'published',
            category: category
          },
          sort: { [sortBy]: -1 }
        })
        
        setPosts(response.list || [])
      } catch (error) {
        console.error('Erro ao carregar posts:', error)
        toast.error('Erro ao carregar posts da categoria')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [category, sortBy])

  useEffect(() => {
    let filtered = [...posts]

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredPosts(filtered)
  }, [posts, searchTerm])

  if (!currentCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Categoria não encontrada</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Voltar ao início
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da Categoria */}
      <div className={`bg-gradient-to-r ${currentCategory.color} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-white/80 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao blog</span>
          </Link>
          
          <div className="text-center">
            <div className="text-6xl mb-4">{currentCategory.icon}</div>
            <h1 className="text-4xl font-bold mb-4">{currentCategory.name}</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {currentCategory.description}
            </p>
            <div className="mt-6 text-white/80">
              {posts.length} {posts.length === 1 ? 'artigo' : 'artigos'} publicados
            </div>
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Busca */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Controles */}
            <div className="flex items-center space-x-4">
              {/* Ordenação */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="publishedAt">Mais recentes</option>
                  <option value="views">Mais visualizados</option>
                  <option value="likes">Mais curtidos</option>
                  <option value="title">Alfabética</option>
                </select>
              </div>

              {/* Modo de visualização */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Nenhum post encontrado' : 'Nenhum post ainda'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? `Tente buscar por outros termos ou explore outras categorias`
                : `Seja o primeiro a contribuir com conteúdo sobre ${currentCategory.name.toLowerCase()}`
              }
            </p>
            {!searchTerm && (
              <Link
                to="/criar-post"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>Criar Primeiro Post</span>
              </Link>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'space-y-6'
          }>
            {filteredPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      {filteredPosts.length > 0 && (
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Contribua com a Comunidade
            </h3>
            <p className="text-gray-600 mb-6">
              Tem conhecimento sobre {currentCategory.name.toLowerCase()}? Compartilhe com nossa comunidade!
            </p>
            <Link
              to="/criar-post"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span>Criar Novo Post</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Category
