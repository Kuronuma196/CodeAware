
// Sistema de Verificação de Conteúdo - Anti-Fake News
export interface VerificationResult {
  isVerified: boolean
  score: number // 0-100, onde 100 é totalmente confiável
  warnings: string[]
  sources: VerifiedSource[]
  recommendation: 'approve' | 'review' | 'reject'
}

export interface VerifiedSource {
  url: string
  domain: string
  credibilityScore: number
  type: 'academic' | 'government' | 'news' | 'tech' | 'unknown'
}

// Lista de fontes confiáveis para verificação
const TRUSTED_SOURCES = {
  academic: [
    'scholar.google.com',
    'ieee.org',
    'acm.org',
    'scielo.org',
    'researchgate.net',
    'arxiv.org',
    'pubmed.ncbi.nlm.nih.gov',
    'jstor.org',
    'springer.com',
    'elsevier.com'
  ],
  government: [
    'gov.br',
    'serpro.gov.br',
    'cert.br',
    'cgi.br',
    'anatel.gov.br',
    'mj.gov.br',
    'pf.gov.br',
    'dpf.gov.br'
  ],
  techNews: [
    'tecnoblog.net',
    'olhardigital.com.br',
    'canaltech.com.br',
    'techtudo.com.br',
    'convergenciadigital.com.br',
    'securityreport.com.br',
    'hackernews.com',
    'arstechnica.com',
    'wired.com',
    'techcrunch.com'
  ],
  cybersecurity: [
    'kaspersky.com.br',
    'symantec.com',
    'mcafee.com',
    'trendmicro.com',
    'checkpoint.com',
    'fortinet.com',
    'paloaltonetworks.com',
    'crowdstrike.com',
    'fireeye.com',
    'sans.org'
  ]
}

// Palavras-chave suspeitas que podem indicar fake news
const SUSPICIOUS_KEYWORDS = [
  'descoberta revolucionária',
  'médicos odeiam',
  'governo esconde',
  'mídia não quer que você saiba',
  'método secreto',
  'conspiração',
  'teoria da conspiração',
  'fake news',
  'informação censurada',
  'verdade oculta'
]

// Padrões de linguagem sensacionalista
const SENSATIONALIST_PATTERNS = [
  /URGENTE:/gi,
  /BOMBA:/gi,
  /EXCLUSIVO:/gi,
  /CHOCANTE:/gi,
  /INACREDITÁVEL:/gi,
  /SURPREENDENTE:/gi,
  /!!!+/g,
  /\b[A-Z]{3,}\b/g // Palavras em CAPS LOCK
]

export class ContentVerificationService {
  
  // Verificação principal do conteúdo
  async verifyContent(title: string, content: string, sources: string[] = []): Promise<VerificationResult> {
    const result: VerificationResult = {
      isVerified: false,
      score: 0,
      warnings: [],
      sources: [],
      recommendation: 'review'
    }

    try {
      // 1. Análise de linguagem sensacionalista
      const languageScore = this.analyzeLanguage(title, content, result.warnings)
      
      // 2. Verificação de fontes
      const sourcesScore = await this.verifySources(sources, result)
      
      // 3. Detecção de palavras-chave suspeitas
      const keywordScore = this.analyzeKeywords(title + ' ' + content, result.warnings)
      
      // 4. Análise de estrutura do conteúdo
      const structureScore = this.analyzeContentStructure(content, result.warnings)
      
      // 5. Verificação de categoria apropriada
      const categoryScore = this.verifyCategoryRelevance(title, content, result.warnings)

      // Cálculo do score final (média ponderada)
      result.score = Math.round(
        (languageScore * 0.2) +
        (sourcesScore * 0.3) +
        (keywordScore * 0.2) +
        (structureScore * 0.15) +
        (categoryScore * 0.15)
      )

      // Determinação da recomendação
      if (result.score >= 80) {
        result.recommendation = 'approve'
        result.isVerified = true
      } else if (result.score >= 60) {
        result.recommendation = 'review'
      } else {
        result.recommendation = 'reject'
      }

      return result

    } catch (error) {
      console.error('Erro na verificação de conteúdo:', error)
      result.warnings.push('Erro durante a verificação. Revisão manual necessária.')
      result.recommendation = 'review'
      return result
    }
  }

  // Análise de linguagem sensacionalista
  private analyzeLanguage(title: string, content: string, warnings: string[]): number {
    let score = 100
    const text = title + ' ' + content

    // Verificar padrões sensacionalistas
    SENSATIONALIST_PATTERNS.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        score -= matches.length * 10
        warnings.push(`Linguagem sensacionalista detectada: ${matches.join(', ')}`)
      }
    })

    // Verificar excesso de pontuação
    const exclamationCount = (text.match(/!/g) || []).length
    if (exclamationCount > 3) {
      score -= (exclamationCount - 3) * 5
      warnings.push('Uso excessivo de pontuação exclamativa')
    }

    return Math.max(0, score)
  }

  // Verificação de fontes confiáveis
  private async verifySources(sources: string[], result: VerificationResult): Promise<number> {
    if (sources.length === 0) {
      result.warnings.push('Nenhuma fonte fornecida para verificação')
      return 50 // Score médio para posts sem fontes
    }

    let totalScore = 0
    const verifiedSources: VerifiedSource[] = []

    for (const source of sources) {
      try {
        const domain = this.extractDomain(source)
        const credibilityScore = this.calculateSourceCredibility(domain)
        const sourceType = this.identifySourceType(domain)

        verifiedSources.push({
          url: source,
          domain,
          credibilityScore,
          type: sourceType
        })

        totalScore += credibilityScore

        if (credibilityScore < 60) {
          result.warnings.push(`Fonte com baixa credibilidade: ${domain}`)
        }

      } catch (error) {
        result.warnings.push(`Erro ao verificar fonte: ${source}`)
      }
    }

    result.sources = verifiedSources
    return sources.length > 0 ? totalScore / sources.length : 0
  }

  // Análise de palavras-chave suspeitas
  private analyzeKeywords(text: string, warnings: string[]): number {
    let score = 100
    const lowerText = text.toLowerCase()

    SUSPICIOUS_KEYWORDS.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        score -= 15
        warnings.push(`Palavra-chave suspeita encontrada: "${keyword}"`)
      }
    })

    return Math.max(0, score)
  }

  // Análise da estrutura do conteúdo
  private analyzeContentStructure(content: string, warnings: string[]): number {
    let score = 100

    // Verificar comprimento mínimo
    if (content.length < 200) {
      score -= 20
      warnings.push('Conteúdo muito curto para verificação adequada')
    }

    // Verificar presença de parágrafos
    const paragraphs = content.split('\n').filter(p => p.trim().length > 0)
    if (paragraphs.length < 2) {
      score -= 15
      warnings.push('Estrutura de texto inadequada (poucos parágrafos)')
    }

    // Verificar presença de dados técnicos
    const hasNumbers = /\d+/.test(content)
    const hasTechnicalTerms = /\b(API|HTTP|SSL|TLS|SQL|JavaScript|Python|React|Node\.js|cybersecurity|malware|phishing)\b/i.test(content)
    
    if (hasNumbers && hasTechnicalTerms) {
      score += 10 // Bonus para conteúdo técnico bem estruturado
    }

    return Math.max(0, Math.min(100, score))
  }

  // Verificação de relevância da categoria
  private verifyCategoryRelevance(title: string, content: string, warnings: string[]): number {
    const text = (title + ' ' + content).toLowerCase()
    
    const categoryKeywords = {
      programacao: ['código', 'programação', 'desenvolvimento', 'software', 'algoritmo', 'javascript', 'python', 'react'],
      ciberseguranca: ['segurança', 'proteção', 'criptografia', 'firewall', 'antivírus', 'vulnerability', 'exploit'],
      cibercrimes: ['crime', 'fraude', 'phishing', 'scam', 'golpe', 'roubo', 'invasão', 'hacker'],
      noticias: ['notícia', 'atualização', 'lançamento', 'empresa', 'mercado', 'tecnologia'],
      leis: ['lei', 'legislação', 'marco civil', 'lgpd', 'regulamentação', 'jurídico', 'direito'],
      campanhas: ['campanha', 'conscientização', 'educação', 'prevenção', 'comunidade']
    }

    let relevanceFound = false
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      const keywordCount = keywords.filter(keyword => text.includes(keyword)).length
      if (keywordCount >= 2) {
        relevanceFound = true
        break
      }
    }

    if (!relevanceFound) {
      warnings.push('Conteúdo pode não estar na categoria apropriada')
      return 70
    }

    return 100
  }

  // Extrair domínio de uma URL
  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
    }
  }

  // Calcular credibilidade da fonte
  private calculateSourceCredibility(domain: string): number {
    // Fontes acadêmicas - máxima credibilidade
    if (TRUSTED_SOURCES.academic.some(trusted => domain.includes(trusted))) {
      return 95
    }

    // Fontes governamentais - alta credibilidade
    if (TRUSTED_SOURCES.government.some(trusted => domain.includes(trusted))) {
      return 90
    }

    // Fontes de cibersegurança - alta credibilidade
    if (TRUSTED_SOURCES.cybersecurity.some(trusted => domain.includes(trusted))) {
      return 85
    }

    // Fontes de tecnologia conhecidas - boa credibilidade
    if (TRUSTED_SOURCES.techNews.some(trusted => domain.includes(trusted))) {
      return 80
    }

    // Domínios .edu e .org - boa credibilidade
    if (domain.endsWith('.edu') || domain.endsWith('.org')) {
      return 75
    }

    // Domínios .gov - alta credibilidade
    if (domain.endsWith('.gov') || domain.endsWith('.gov.br')) {
      return 90
    }

    // Outras fontes - credibilidade média
    return 60
  }

  // Identificar tipo de fonte
  private identifySourceType(domain: string): 'academic' | 'government' | 'news' | 'tech' | 'unknown' {
    if (TRUSTED_SOURCES.academic.some(trusted => domain.includes(trusted))) {
      return 'academic'
    }
    if (TRUSTED_SOURCES.government.some(trusted => domain.includes(trusted))) {
      return 'government'
    }
    if (TRUSTED_SOURCES.techNews.some(trusted => domain.includes(trusted))) {
      return 'news'
    }
    if (TRUSTED_SOURCES.cybersecurity.some(trusted => domain.includes(trusted))) {
      return 'tech'
    }
    return 'unknown'
  }
}

// Instância singleton do serviço
export const contentVerificationService = new ContentVerificationService()
