
import React from 'react'
import { Link } from 'react-router-dom'
import {Code, Shield, Mail, Github, Twitter, Linkedin, Heart} from 'lucide-react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    categorias: [
      { name: 'Programação', href: '/categoria/programacao' },
      { name: 'Cibersegurança', href: '/categoria/ciberseguranca' },
      { name: 'Crimes Digitais', href: '/categoria/cibercrimes' },
      { name: 'Campanhas', href: '/categoria/campanhas' },
      { name: 'Notícias', href: '/categoria/noticias' },
      { name: 'Legislação', href: '/categoria/leis' }
    ],
    recursos: [
      { name: 'Criar Post', href: '/criar-post' },
      { name: 'Sobre Nós', href: '/sobre' },
      { name: 'Política de Privacidade', href: '/privacidade' },
      { name: 'Termos de Uso', href: '/termos' },
      { name: 'Contato', href: '/contato' },
      { name: 'FAQ', href: '/faq' }
    ]
  }

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/codeaware' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/codeaware' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/codeaware' }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Code className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  CodeAware
                </h3>
                <p className="text-gray-400 text-sm">Conscientização Digital</p>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              Promovemos a conscientização sobre programação, cibersegurança e cidadania digital. 
              Juntos, construímos um ambiente online mais seguro e informado para todos.
            </p>
            
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categorias</h4>
            <ul className="space-y-2">
              {footerLinks.categorias.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2">
              {footerLinks.recursos.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-lg font-semibold mb-2">Fique por dentro das novidades</h4>
            <p className="text-gray-400 mb-4">
              Receba as últimas notícias sobre segurança digital e programação
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Seu email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Inscrever</span>
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 flex items-center justify-center space-x-1">
            <span>© {currentYear} CodeAware. Feito com</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>para a comunidade tech brasileira.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
