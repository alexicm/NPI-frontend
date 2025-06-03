"use client"

import React, { useMemo } from "react"
import { motion } from "framer-motion"
import type { Course } from "@/lib/types"
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer"
import PerformanceImage from "@/components/PerformanceImage"
import ExpandableSection from "@/components/ExpandableSection"
import CoordinatorItem from "@/components/CoordinatorItem"
import { BookOpen, Users, Target, BarChart3, Clock, MessageSquare } from "lucide-react"

interface CourseDetailsProps {
  course: Course
  onStatusChange: (newStatus: string) => Promise<void>
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ course, onStatusChange }) => {
  const totalCargaHoraria = useMemo(() => {
    return course.disciplinasIA.reduce((total, disciplina) => {
      return total + (disciplina.carga || 0)
    }, 0)
  }, [course.disciplinasIA])

  const coordenadores = course.coordenadores || []

  if (!course || typeof course !== "object") {
    return (
      <div role="alert" className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-xl">
        <h3 className="font-semibold mb-2">Erro: Dados do curso inválidos</h3>
        <p className="text-sm">Não foi possível carregar as informações do curso.</p>
      </div>
    )
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="relative min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {/* First Column: Informações do Curso */}
          <motion.div className="flex flex-col gap-6" variants={sectionVariants}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Informações do Curso</h2>
              </div>

              <div className="space-y-4">
                <ExpandableSection title="Apresentação">
                  <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 mb-6">
                    <p className="text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                      {course.apresentacao}
                    </p>
                  </div>
                  {course.videoUrl ? (
                    <div className="mb-6">
                      <VideoPlayer videoUrl={course.videoUrl} />
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BookOpen className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                        Nenhum vídeo disponível para este curso.
                      </p>
                    </div>
                  )}
                </ExpandableSection>

                <ExpandableSection title="Coordenadores">
                  <div className="space-y-4">
                    {coordenadores.length > 0 ? (
                      coordenadores.map((coord, index) => <CoordinatorItem key={index} coordinator={coord} />)
                    ) : (
                      <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Nenhum coordenador cadastrado para este curso.
                        </p>
                      </div>
                    )}
                  </div>
                </ExpandableSection>

                <ExpandableSection title="Público Alvo">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
                    <div className="flex items-start">
                      <Target className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                      <p className="text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                        {course.publico}
                      </p>
                    </div>
                  </div>
                </ExpandableSection>

                <ExpandableSection title="Disciplinas">
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[400px] text-sm sm:text-base">
                        <thead>
                          <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                            <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                              <BookOpen className="w-4 h-4 mr-2" />
                              Disciplina
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                Carga Horária
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {course.disciplinasIA.map((disciplina, index) => (
                            <tr
                              key={index}
                              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{disciplina.nome}</td>
                              <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">
                                {disciplina.carga}h
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 font-bold">
                            <td className="px-4 py-3 text-orange-800 dark:text-orange-200">Total</td>
                            <td className="px-4 py-3 text-orange-800 dark:text-orange-200">{totalCargaHoraria}h</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </ExpandableSection>
              </div>
            </div>
          </motion.div>

          {/* Second Column: Informações Úteis */}
          <motion.div className="flex flex-col gap-6" variants={sectionVariants}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Informações Úteis</h2>
              </div>

              <div className="space-y-4">
                {course.observacoesComite && (
                  <ExpandableSection title="Observações do Comitê">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-700">
                      <div className="flex items-start">
                        <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                        <p className="text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {course.observacoesComite}
                        </p>
                      </div>
                    </div>
                  </ExpandableSection>
                )}

                <ExpandableSection title="Concorrentes">
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[500px] text-sm sm:text-base">
                        <thead>
                          <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                            <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">
                              Instituição
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">
                              Curso
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">
                              Valor
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(course.concorrentesIA) && course.concorrentesIA.length > 0 ? (
                            course.concorrentesIA.map((concorrente, index) => (
                              <tr
                                key={index}
                                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                              >
                                <td className="px-4 py-3">
                                  {concorrente.link ? (
                                    <a
                                      href={concorrente.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:underline focus:outline-none focus:ring-2 focus:ring-orange-500 rounded transition-colors"
                                    >
                                      {concorrente.instituicao}
                                    </a>
                                  ) : (
                                    <span className="text-gray-700 dark:text-gray-300">{concorrente.instituicao}</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{concorrente.curso}</td>
                                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">
                                  {concorrente.valor || "Não informado"}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={3} className="text-center py-8">
                                <div className="flex flex-col items-center">
                                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                                    <BarChart3 className="w-6 h-6 text-gray-400" />
                                  </div>
                                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    Nenhum dado de concorrente disponível
                                  </p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </ExpandableSection>

                {course.performance && (
                  <ExpandableSection title="Performance">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-700">
                      <PerformanceImage imageUrl={course.performance} />
                    </div>
                  </ExpandableSection>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default React.memo(CourseDetails)
