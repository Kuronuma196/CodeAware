
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { lumi } from '../lib/lumi'
import PostCard from '../components/PostCard'
import {Code, Shield, Users, FileText, BookOpen, Gavel, TrendingUp, Star} from 'lucide-react'
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

const Home: React.FC = () => {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([])
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const categories = [
    {
      name: 'Programação',
      slug: 'programacao',
      icon: Code,
      description: 'Aprenda sobre desenvolvimento de software e boas práticas',
      color: 'from-blue-500 to-blue-600',
      count: '45+ artigos'
    },
    {
      name: 'Cibersegurança',
      slug: 'ciberseguranca',
      icon: Shield,
      description: 'Proteja-se contra ameaças digitais e crimes online',
      color: 'from-red-500 to-red-600',
      count: '32+ artigos'
    },
    {
      name: 'Crimes Digitais',
      slug: 'cibercrimes',
      icon: Users,
      description: 'Entenda e previna-se contra crimes cibernéticos',
      color: 'from-orange-500 to-orange-600',
      count: '28+ artigos'
    },
    {
      name: 'Campanhas',
      slug: 'campanhas',
      icon: TrendingUp,
      description: 'Participe de campanhas de conscientização digital',
      color: 'from-green-500 to-green-600',
      count: '15+ campanhas'
    },
    {
      name: 'Notícias',
      slug: 'noticias',
      icon: FileText,
      description: 'Fique por dentro das últimas notícias tech',
      color: 'from-purple-500 to-purple-600',
      count: '50+ notícias'
    },
    {
      name: 'Legislação',
      slug: 'leis',
      icon: Gavel,
      description: 'Conheça as leis que regem o mundo digital',
      color: 'from-yellow-500 to-yellow-600',
      count: '20+ artigos'
    }
  ]

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        
        // Buscar posts em destaque
        const featuredResponse = await lumi.entities.posts.list({
          filter: { status: 'published', featured: true },
          sort: { publishedAt: -1 },
          limit: 3
        })
        
        // Buscar posts recentes
        const recentResponse = await lumi.entities.posts.list({
          filter: { status: 'published' },
          sort: { publishedAt: -1 },
          limit: 6
        })
        
        setFeaturedPosts(featuredResponse.list || [])
        setRecentPosts(recentResponse.list || [])
      } catch (error) {
        console.error('Erro ao carregar posts:', error)
        toast.error('Erro ao carregar posts')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando conteúdo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg')] bg-cover bg-center opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CodeAware
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Seu portal de conscientização sobre <strong>programação</strong>, <strong>cibersegurança</strong> e <strong>cidadania digital</strong>
            </p>
            
            <p className="text-lg text-blue-200 mb-12 max-w-3xl mx-auto">
              Compartilhe conhecimento, aprenda sobre segurança digital e ajude a construir 
              um ambiente online mais seguro para todos. Juntos, somos mais fortes contra as ameaças digitais.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/criar-post"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <FileText className="w-5 h-5" />
                <span>Compartilhar Conhecimento</span>
              </Link>
              <Link
                to="/categoria/ciberseguranca"
                className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Shield className="w-5 h-5" />
                <span>Aprender Segurança</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Star className="w-6 h-6 text-yellow-500" />
                <h2 className="text-3xl font-bold text-gray-900">Posts em Destaque</h2>
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Conteúdos selecionados pela nossa equipe para manter você informado sobre as principais tendências em tecnologia e segurança digital.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts[0] && (
                <div className="lg:col-span-2">
                  <PostCard post={featuredPosts[0]} featured={true} />
                </div>
              )}
              {featuredPosts.slice(1).map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore por Categoria</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubra conteúdos organizados por área de interesse. Cada categoria oferece insights valiosos para sua jornada digital.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.slug}
                  to={`/categoria/${category.slug}`}
                  className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500">{category.count}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Artigos Recentes</h2>
                <p className="text-gray-600">Fique por dentro das últimas publicações da nossa comunidade</p>
              </div>
              <Link
                to="/categoria/noticias"
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 group"
              >
                <span>Ver todos</span>
                <BookOpen className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Faça Parte da Comunidade CodeAware
          </h2>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Contribua com seu conhecimento, compartilhe experiências e ajude outros a se protegerem no mundo digital. 
            Sua participação faz a diferença!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/criar-post"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <FileText className="w-5 h-5" />
              <span>Criar Meu Primeiro Post</span>
            </Link>
            <Link
              to="/sobre"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Users className="w-5 h-5" />
              <span>Sobre o Projeto</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
