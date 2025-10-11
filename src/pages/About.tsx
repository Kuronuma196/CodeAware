
import React from 'react'
import { Link } from 'react-router-dom'
import {Code, Shield, Users, Target, Heart, Globe, BookOpen, Lightbulb} from 'lucide-react'

const About: React.FC = () => {
  const teamMembers = [
    {
      name: 'Carlos E. Kuronuma',
      role: 'Desenvolvedor Full Stack & Fundador',
      description: 'Especialista em desenvolvimento web e segurança digital, apaixonado por educação tecnológica e conscientização sobre crimes cibernéticos',
      avatar: '/carlos-kuronuma2.jpeg' // Imagem do jovem de óculos
    },
    {
      name: 'Thiago Henrique',
      role: 'Especialista em Cibersegurança & Co-fundador',
      description: 'Consultor em segurança digital e crimes cibernéticos, focado em educação e prevenção de ameaças digitais',
      avatar: '/thiago-henrique.jpeg' // Imagem do jovem de terno
    }
  ]

  const values = [
    {
      icon: BookOpen,
      title: 'Educação Acessível',
      description: 'Democratizamos o conhecimento sobre tecnologia e segurança digital para todos'
    },
    {
      icon: Shield,
      title: 'Segurança em Primeiro Lugar',
      description: 'Priorizamos a proteção e conscientização sobre ameaças digitais'
    },
    {
      icon: Users,
      title: 'Comunidade Colaborativa',
      description: 'Construímos uma rede de pessoas comprometidas com a segurança digital'
    },
    {
      icon: Lightbulb,
      title: 'Inovação Responsável',
      description: 'Promovemos o uso ético e responsável da tecnologia'
    }
  ]

  const stats = [
    { number: '5+', label: 'Artigos Publicados' },
    { number: '2+', label: 'Leitores Mensais' },
    { number: '10+', label: 'Colaboradores' },
    { number: '100+', label: 'Países Alcançados' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg')] bg-cover bg-center opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-3xl flex items-center justify-center">
                  <Code className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Sobre o <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CodeAware
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Construindo uma comunidade mais segura e consciente no mundo digital
            </p>
          </div>
        </div>
      </section>

      {/* Missão */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Target className="w-8 h-8 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900">Nossa Missão</h2>
              </div>
              
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                O CodeAware nasceu da necessidade de democratizar o conhecimento sobre programação, 
                cibersegurança e cidadania digital. Acreditamos que a educação é a melhor ferramenta 
                para combater crimes cibernéticos e promover o uso responsável da tecnologia.
              </p>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Nossa plataforma conecta especialistas, entusiastas e iniciantes em um ambiente 
                colaborativo onde o conhecimento é compartilhado livremente, criando uma rede 
                de proteção coletiva contra ameaças digitais.
              </p>
              
              <Link
                to="/criar-post"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>Junte-se à Missão</span>
                <Heart className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg"
                alt="Equipe colaborando"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <Globe className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nosso Impacto</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Números que demonstram o crescimento e alcance da nossa comunidade
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossos Valores</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Os princípios que guiam nossa abordagem à educação digital e segurança online
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossa Equipe</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Os fundadores dedicados à missão de tornar o mundo digital mais seguro e consciente
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-80 overflow-hidden">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Contribuir */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Como Você Pode Contribuir</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Compartilhe Conhecimento</h3>
              <p className="text-gray-600">Escreva artigos sobre suas experiências e conhecimentos em tecnologia</p>
            </div>
            
            <div className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Engaje com a Comunidade</h3>
              <p className="text-gray-600">Comente, compartilhe e ajude outros membros da comunidade</p>
            </div>
            
            <div className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Promova Segurança</h3>
              <p className="text-gray-600">Ajude a espalhar práticas de segurança digital em sua rede</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/criar-post"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Começar a Contribuir
            </Link>
            <Link
              to="/categoria/ciberseguranca"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Explorar Conteúdo
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
