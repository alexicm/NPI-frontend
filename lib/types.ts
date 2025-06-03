export interface User {
  id: string
  nome: string
  email: string
  permissao: number
}

export interface Coordinator {
  nome: string
  minibiografia: string
  jaECoordenador: boolean
}

export interface Course {
  id: string
  nome: string
  coordenadorSolicitante: string
  coordenadores: Coordinator[]
  apresentacao: string
  publico: string
  concorrentesIA: Array<{
    instituicao: string
    curso: string
    link: string
    valor: string
  }>
  performance: string
  videoUrl: string
  disciplinasIA: Array<{ nome: string; carga: string }>
  status?: string
  observacoesComite: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}
