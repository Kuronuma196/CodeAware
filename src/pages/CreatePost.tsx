
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { lumi } from '../lib/lumi'
import { contentVerificationService } from '../utils/contentVerification'
import {FileText, Save, Eye, Image, Tag, User, Clock, Shield, AlertTriangle, CheckCircle, Link as LinkIcon} from 'lucide-react'
import toast from 'react-hot-toast'

const CreatePost: React.FC = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'programacao',
    tags: '',
    author: '',
    authorEmail: '',
    imageUrl: '',
    sources: '', // Novo campo para fontes
    readTime: 5,
    featured: false
  })

  const categories = [
    { value: 'programacao', label: 'Programação' },
    { value: 'ciberseguranca', label: 'Cibersegurança' },
    { value: 'cibercrimes', label: 'Crimes Digitais' },
    { value: 'campanhas', label: 'Campanhas' },
    { value: 'noticias', label: 'Notícias' },
    { value: 'leis', label: 'Legislação' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Limpar verificação anterior quando o conteúdo mudar
    if (name === 'title' || name === 'content' || name === 'sources') {
      setVerificationResult(null)
    }
  }

  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200
    const wordCount = content.trim().split(/\s+/).length
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
  }

  const verifyContent = async () => {
    if (!formData.title || !formData.content) {
      toast.error('Preencha título e conteúdo para verificar')
      return
    }

    setIsVerifying(true)

    try {
      const sources = formData.sources
        .split('\n')
        .map(source => source.trim())
        .filter(source => source.length > 0)

      const result = await contentVerificationService.verifyContent(
        formData.title,
        formData.content,
        sources
      )

      setVerificationResult(result)

      if (result.recommendation === 'reject') {
        toast.error('Conteúdo não passou na verificação de credibilidade')
      } else if (result.recommendation === 'review') {
        toast.warning('Conteúdo requer revisão antes da publicação')
      } else {
        toast.success('Conteúdo verificado com sucesso!')
      }

    } catch (error) {
      console.error('Erro na verificação:', error)
      toast.error('Erro durante a verificação')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.content || !formData.author || !formData.authorEmail) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    // Verificar conteúdo antes de submeter
    if (!verificationResult) {
      toast.error('Execute a verificação de conteúdo antes de publicar')
      return
    }

    if (verificationResult.recommendation === 'reject') {
      toast.error('Não é possível publicar conteúdo que falhou na verificação')
      return
    }

    setIsSubmitting(true)

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const sourcesArray = formData.sources
        .split('\n')
        .map(source => source.trim())
        .filter(source => source.length > 0)

      const postData = {
        title: formData.title,
        excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
        content: formData.content,
        category: formData.category,
        tags: tagsArray,
        sources: sourcesArray,
        author: formData.author,
        authorEmail: formData.authorEmail,
        status: verificationResult.recommendation === 'approve' ? 'published' : 'pending',
        featured: formData.featured,
        imageUrl: formData.imageUrl || 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
        readTime: calculateReadTime(formData.content),
        views: 0,
        likes: 0,
        verificationScore: verificationResult.score,
        verificationResult: verificationResult,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: verificationResult.recommendation === 'approve' ? new Date().toISOString() : undefined
      }

      const newPost = await lumi.entities.posts.create(postData)
      
      if (verificationResult.recommendation === 'approve') {
        toast.success('Post criado e publicado com sucesso!')
        navigate(`/post/${newPost._id}`)
      } else {
        toast.success('Post enviado para moderação!')
        navigate('/')
      }
    } catch (error) {
      console.error('Erro ao criar post:', error)
      toast.error('Erro ao criar post. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getVerificationIcon = () => {
    if (!verificationResult) return <Shield className="w-5 h-5 text-gray-400" />
    
    switch (verificationResult.recommendation) {
      case 'approve':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'review':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'reject':
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      default:
        return <Shield className="w-5 h-5 text-gray-400" />
    }
  }

  const getVerificationColor = () => {
    if (!verificationResult) return 'border-gray-300'
    
    switch (verificationResult.recommendation) {
      case 'approve':
        return 'border-green-500 bg-green-50'
      case 'review':
        return 'border-yellow-500 bg-yellow-50'
      case 'reject':
        return 'border-red-500 bg-red-50'
      default:
        return 'border-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Novo Post</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Compartilhe seu conhecimento com verificação automática anti-fake news
          </p>
        </div>

        {/* Verification Status */}
        {verificationResult && (
          <div className={`mb-6 p-4 rounded-lg border-2 ${getVerificationColor()}`}>
            <div className="flex items-center space-x-3 mb-3">
              {getVerificationIcon()}
              <h3 className="font-semibold">
                Resultado da Verificação: {verificationResult.score}% de Credibilidade
              </h3>
            </div>
            
            {verificationResult.warnings.length > 0 && (
              <div className="mb-3">
                <h4 className="font-medium text-sm mb-2">Alertas:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {verificationResult.warnings.map((warning: string, index: number) => (
                    <li key={index} className="text-red-600">{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-sm">
              <strong>Recomendação:</strong> {
                verificationResult.recommendation === 'approve' ? 'Aprovado para publicação' :
                verificationResult.recommendation === 'review' ? 'Requer revisão manual' :
                'Não recomendado para publicação'
              }
            </p>
          </div>
        )}

        {/* Toggle Preview */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !showPreview 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Editar
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                showPreview 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Preview
            </button>
          </div>
        </div>

        {showPreview ? (
          /* Preview Mode */
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt={formData.title}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-6">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {categories.find(cat => cat.value === formData.category)?.label}
                </span>
                {formData.featured && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    Destaque
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {formData.title || 'Título do seu post'}
              </h1>
              
              <div className="flex items-center space-x-6 text-gray-600 mb-6">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{formData.author || 'Seu nome'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{calculateReadTime(formData.content)} min de leitura</span>
                </div>
              </div>
              
              {formData.excerpt && (
                <p className="text-xl text-gray-600 mb-6 italic">
                  {formData.excerpt}
                </p>
              )}
              
              <div className="prose max-w-none text-gray-700">
                {formData.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              {formData.tags && (
                <div className="flex items-center space-x-2 mt-6 pt-6 border-t border-gray-200">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="Digite o título do seu post..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                    Resumo
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Breve descrição do seu post (opcional - será gerado automaticamente se não preenchido)"
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    Conteúdo *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={15}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Escreva o conteúdo completo do seu post..."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Tempo estimado de leitura: {calculateReadTime(formData.content)} minutos
                  </p>
                </div>

                {/* Novo campo para fontes */}
                <div>
                  <label htmlFor="sources" className="block text-sm font-medium text-gray-700 mb-2">
                    <LinkIcon className="w-4 h-4 inline mr-1" />
                    Fontes e Referências
                  </label>
                  <textarea
                    id="sources"
                    name="sources"
                    value={formData.sources}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Cole aqui os links das suas fontes (um por linha)&#10;https://scholar.google.com/...&#10;https://ieee.org/...&#10;https://gov.br/..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Adicione links de fontes confiáveis para aumentar a credibilidade do seu post
                  </p>
                </div>

                {/* Botão de Verificação */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <button
                    type="button"
                    onClick={verifyContent}
                    disabled={isVerifying || !formData.title || !formData.content}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Shield className="w-5 h-5" />
                    <span>{isVerifying ? 'Verificando Conteúdo...' : 'Verificar Credibilidade'}</span>
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Sistema anti-fake news • Verificação obrigatória antes da publicação
                  </p>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="segurança, hacking, proteção"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Separe as tags com vírgulas
                  </p>
                </div>

                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    URL da Imagem
                  </label>
                  <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Deixe em branco para usar imagem padrão
                  </p>
                </div>

                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="authorEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Seu Email *
                  </label>
                  <input
                    type="email"
                    id="authorEmail"
                    name="authorEmail"
                    value={formData.authorEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                    Marcar como destaque
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !verificationResult}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>
                  {isSubmitting ? 'Publicando...' : 
                   verificationResult?.recommendation === 'approve' ? 'Publicar Post' : 
                   'Enviar para Moderação'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default CreatePost
