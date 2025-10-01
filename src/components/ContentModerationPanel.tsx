
import React, { useState, useEffect } from 'react'
import { lumi } from '../lib/lumi'
import { contentVerificationService, VerificationResult } from '../utils/contentVerification'
import {Shield, AlertTriangle, CheckCircle, XCircle, Eye, ExternalLink, Clock} from 'lucide-react'
import toast from 'react-hot-toast'

interface PendingPost {
  _id: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  authorEmail: string
  status: string
  sources?: string[]
  createdAt: string
  verificationResult?: VerificationResult
}

const ContentModerationPanel: React.FC = () => {
  const [pendingPosts, setPendingPosts] = useState<PendingPost[]>([])
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState<string | null>(null)
  const [selectedPost, setSelectedPost] = useState<PendingPost | null>(null)

  useEffect(() => {
    fetchPendingPosts()
  }, [])

  const fetchPendingPosts = async () => {
    try {
      setLoading(true)
      const response = await lumi.entities.posts.list({
        filter: { status: 'pending' },
        sort: { createdAt: -1 }
      })
      setPendingPosts(response.list || [])
    } catch (error) {
      console.error('Erro ao carregar posts pendentes:', error)
      toast.error('Erro ao carregar posts pendentes')
    } finally {
      setLoading(false)
    }
  }

  const verifyPost = async (post: PendingPost) => {
    try {
      setVerifying(post._id)
      
      // Extrair possíveis fontes do conteúdo
      const urlRegex = /https?:\/\/[^\s]+/g
      const sources = post.content.match(urlRegex) || []
      
      const verificationResult = await contentVerificationService.verifyContent(
        post.title,
        post.content,
        sources
      )

      // Atualizar post com resultado da verificação
      const updatedPost = { ...post, verificationResult, sources }
      setPendingPosts(prev => 
        prev.map(p => p._id === post._id ? updatedPost : p)
      )

      toast.success('Verificação concluída!')
    } catch (error) {
      console.error('Erro na verificação:', error)
      toast.error('Erro durante a verificação')
    } finally {
      setVerifying(null)
    }
  }

  const approvePost = async (post: PendingPost) => {
    try {
      await lumi.entities.posts.update(post._id, {
        status: 'published',
        publishedAt: new Date().toISOString()
      })
      
      setPendingPosts(prev => prev.filter(p => p._id !== post._id))
      toast.success('Post aprovado e publicado!')
    } catch (error) {
      console.error('Erro ao aprovar post:', error)
      toast.error('Erro ao aprovar post')
    }
  }

  const rejectPost = async (post: PendingPost, reason: string) => {
    try {
      await lumi.entities.posts.update(post._id, {
        status: 'rejected',
        rejectionReason: reason
      })
      
      setPendingPosts(prev => prev.filter(p => p._id !== post._id))
      toast.success('Post rejeitado')
    } catch (error) {
      console.error('Erro ao rejeitar post:', error)
      toast.error('Erro ao rejeitar post')
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'approve': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'review': return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'reject': return <XCircle className="w-5 h-5 text-red-600" />
      default: return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando posts para moderação...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel de Moderação</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sistema de verificação anti-fake news para garantir a qualidade e credibilidade do conteúdo
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Posts Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{pendingPosts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verificados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingPosts.filter(p => p.verificationResult).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Requer Atenção</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingPosts.filter(p => p.verificationResult?.recommendation === 'reject').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts List */}
        {pendingPosts.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum post pendente
            </h3>
            <p className="text-gray-600">
              Todos os posts foram verificados e moderados
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingPosts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Por: {post.author}</span>
                        <span>Categoria: {post.category}</span>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {post.verificationResult ? (
                        <div className="text-center">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(post.verificationResult.score)}`}>
                            Score: {post.verificationResult.score}%
                          </div>
                          <div className="flex items-center justify-center mt-2">
                            {getRecommendationIcon(post.verificationResult.recommendation)}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => verifyPost(post)}
                          disabled={verifying === post._id}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {verifying === post._id ? 'Verificando...' : 'Verificar'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Verification Results */}
                  {post.verificationResult && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Resultado da Verificação</h4>
                      
                      {/* Warnings */}
                      {post.verificationResult.warnings.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-red-700 mb-2">Alertas Detectados:</h5>
                          <ul className="list-disc list-inside space-y-1">
                            {post.verificationResult.warnings.map((warning, index) => (
                              <li key={index} className="text-sm text-red-600">{warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Sources */}
                      {post.verificationResult.sources.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Fontes Verificadas:</h5>
                          <div className="space-y-2">
                            {post.verificationResult.sources.map((source, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                <div>
                                  <a 
                                    href={source.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                                  >
                                    <span className="truncate max-w-xs">{source.domain}</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                  <p className="text-xs text-gray-500">Tipo: {source.type}</p>
                                </div>
                                <div className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(source.credibilityScore)}`}>
                                  {source.credibilityScore}%
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setSelectedPost(post)}
                          className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Ver Conteúdo Completo</span>
                        </button>
                        
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => rejectPost(post, 'Falhou na verificação de credibilidade')}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Rejeitar
                          </button>
                          <button
                            onClick={() => approvePost(post)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Aprovar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for full content view */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPost.title}</h2>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="prose max-w-none">
                  {selectedPost.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContentModerationPanel
