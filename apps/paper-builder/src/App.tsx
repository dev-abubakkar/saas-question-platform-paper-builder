"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { create } from "zustand"
import { FiPlus, FiFileText, FiTrash2 } from "react-icons/fi"
import clsx from "clsx"
import "./styles/globals.css"

// Zod schemas
const sectionSchema = z.object({
  title: z.string().min(1, "Section title is required"),
  instructions: z.string().min(1, "Instructions are required"),
  marks: z.number().min(1, "Marks must be at least 1"),
  timeLimit: z.number().optional(),
})

const paperSchema = z.object({
  title: z.string().min(1, "Paper title is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  totalMarks: z.number().min(1, "Total marks must be at least 1"),
})

type SectionForm = z.infer<typeof sectionSchema>
type PaperForm = z.infer<typeof paperSchema>

interface Section extends SectionForm {
  id: string
  questions: string[]
  createdAt: Date
}

interface Paper extends PaperForm {
  id: string
  sections: Section[]
  createdAt: Date
  status: "draft" | "published" | "archived"
}

// Zustand store
interface PaperStore {
  papers: Paper[]
  currentPaper: Partial<Paper> | null
  addPaper: (paper: Omit<Paper, "id" | "createdAt">) => void
  updatePaper: (id: string, paper: Partial<Paper>) => void
  deletePaper: (id: string) => void
  setCurrentPaper: (paper: Partial<Paper> | null) => void
  addSectionToPaper: (paperId: string, section: Omit<Section, "id" | "createdAt">) => void
  removeSectionFromPaper: (paperId: string, sectionId: string) => void
}

const usePaperStore = create<PaperStore>((set, get) => ({
  papers: [
    {
      id: "1",
      title: "Mathematics Final Exam",
      description: "Comprehensive mathematics examination covering algebra and geometry",
      duration: 120,
      totalMarks: 100,
      sections: [
        {
          id: "1",
          title: "Multiple Choice Questions",
          instructions: "Choose the best answer for each question",
          marks: 40,
          timeLimit: 30,
          questions: [],
          createdAt: new Date(),
        },
        {
          id: "2",
          title: "Problem Solving",
          instructions: "Show all work for full credit",
          marks: 60,
          timeLimit: 90,
          questions: [],
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
      status: "draft",
    },
  ],
  currentPaper: null,
  addPaper: (paper) =>
    set((state) => ({
      papers: [
        ...state.papers,
        {
          ...paper,
          id: Date.now().toString(),
          createdAt: new Date(),
        },
      ],
    })),
  updatePaper: (id, updatedPaper) =>
    set((state) => ({
      papers: state.papers.map((p) => (p.id === id ? { ...p, ...updatedPaper } : p)),
    })),
  deletePaper: (id) =>
    set((state) => ({
      papers: state.papers.filter((p) => p.id !== id),
    })),
  setCurrentPaper: (paper) => set({ currentPaper: paper }),
  addSectionToPaper: (paperId, section) =>
    set((state) => ({
      papers: state.papers.map((p) =>
        p.id === paperId
          ? {
              ...p,
              sections: [
                ...p.sections,
                {
                  ...section,
                  id: Date.now().toString(),
                  createdAt: new Date(),
                },
              ],
            }
          : p,
      ),
    })),
  removeSectionFromPaper: (paperId, sectionId) =>
    set((state) => ({
      papers: state.papers.map((p) =>
        p.id === paperId
          ? {
              ...p,
              sections: p.sections.filter((s) => s.id !== sectionId),
            }
          : p,
      ),
    })),
}))

const PaperBuilderApp: React.FC = () => {
  const { papers, currentPaper, addPaper, deletePaper, setCurrentPaper, addSectionToPaper } = usePaperStore()
  const [activeTab, setActiveTab] = React.useState<"create" | "manage">("create")

  const {
    register: registerPaper,
    handleSubmit: handlePaperSubmit,
    reset: resetPaper,
    formState: { errors: paperErrors },
  } = useForm<PaperForm>({
    resolver: zodResolver(paperSchema),
    defaultValues: {
      duration: 60,
      totalMarks: 100,
    },
  })

  const {
    register: registerSection,
    handleSubmit: handleSectionSubmit,
    reset: resetSection,
    formState: { errors: sectionErrors },
  } = useForm<SectionForm>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      marks: 10,
    },
  })

  const onCreatePaper = (data: PaperForm) => {
    const newPaper = {
      ...data,
      sections: [],
      status: "draft" as const,
    }
    addPaper(newPaper)
    setCurrentPaper(newPaper)
    resetPaper()
  }

  const onAddSection = (data: SectionForm) => {
    if (currentPaper?.id) {
      addSectionToPaper(currentPaper.id, {
        ...data,
        questions: [],
      })
      resetSection()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "published":
        return "bg-green-100 text-green-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paper Builder</h1>
          <p className="text-gray-600 mt-2">Design and structure examination papers</p>
        </div>
        <div className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">
          React + TypeScript + Zod + Zustand
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("create")}
            className={clsx(
              "py-2 px-1 border-b-2 font-medium text-sm",
              activeTab === "create"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
            )}
          >
            Create Paper
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={clsx(
              "py-2 px-1 border-b-2 font-medium text-sm",
              activeTab === "manage"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
            )}
          >
            Manage Papers ({papers.length})
          </button>
        </nav>
      </div>

      {activeTab === "create" && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Paper Creation Form */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiFileText className="text-green-500" />
                Paper Details
              </h2>

              <form onSubmit={handlePaperSubmit(onCreatePaper)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Paper Title</label>
                  <input
                    {...registerPaper("title")}
                    type="text"
                    className={clsx("input", paperErrors.title && "border-red-500")}
                    placeholder="e.g., Mathematics Final Exam"
                  />
                  {paperErrors.title && <p className="text-red-500 text-sm mt-1">{paperErrors.title.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    {...registerPaper("description")}
                    className={clsx("input h-20", paperErrors.description && "border-red-500")}
                    placeholder="Brief description of the examination"
                  />
                  {paperErrors.description && (
                    <p className="text-red-500 text-sm mt-1">{paperErrors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                    <input
                      {...registerPaper("duration", { valueAsNumber: true })}
                      type="number"
                      className={clsx("input", paperErrors.duration && "border-red-500")}
                      placeholder="120"
                    />
                    {paperErrors.duration && (
                      <p className="text-red-500 text-sm mt-1">{paperErrors.duration.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Total Marks</label>
                    <input
                      {...registerPaper("totalMarks", { valueAsNumber: true })}
                      type="number"
                      className={clsx("input", paperErrors.totalMarks && "border-red-500")}
                      placeholder="100"
                    />
                    {paperErrors.totalMarks && (
                      <p className="text-red-500 text-sm mt-1">{paperErrors.totalMarks.message}</p>
                    )}
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  <FiPlus className="w-4 h-4" />
                  Create Paper
                </button>
              </form>
            </div>

            {/* Section Form */}
            {currentPaper && (
              <div className="card mt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiPlus className="text-blue-500" />
                  Add Section
                </h2>

                <form onSubmit={handleSectionSubmit(onAddSection)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Section Title</label>
                    <input
                      {...registerSection("title")}
                      type="text"
                      className={clsx("input", sectionErrors.title && "border-red-500")}
                      placeholder="e.g., Multiple Choice Questions"
                    />
                    {sectionErrors.title && <p className="text-red-500 text-sm mt-1">{sectionErrors.title.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Instructions</label>
                    <textarea
                      {...registerSection("instructions")}
                      className={clsx("input h-20", sectionErrors.instructions && "border-red-500")}
                      placeholder="Instructions for this section"
                    />
                    {sectionErrors.instructions && (
                      <p className="text-red-500 text-sm mt-1">{sectionErrors.instructions.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Marks</label>
                      <input
                        {...registerSection("marks", { valueAsNumber: true })}
                        type="number"
                        className={clsx("input", sectionErrors.marks && "border-red-500")}
                        placeholder="10"
                      />
                      {sectionErrors.marks && (
                        <p className="text-red-500 text-sm mt-1">{sectionErrors.marks.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Time Limit (min)</label>
                      <input
                        {...registerSection("timeLimit", { valueAsNumber: true })}
                        type="number"
                        className="input"
                        placeholder="30"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-secondary w-full flex items-center justify-center gap-2">
                    <FiPlus className="w-4 h-4" />
                    Add Section
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Paper Preview */}
          <div className="lg:col-span-2">
            {currentPaper ? (
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Paper Preview</h2>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{currentPaper.title}</h3>
                    <p className="text-gray-600 mt-2">{currentPaper.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span>Duration: {currentPaper.duration} minutes</span>
                      <span>Total Marks: {currentPaper.totalMarks}</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Draft</span>
                    </div>
                  </div>

                  {currentPaper.sections && currentPaper.sections.length > 0 ? (
                    <div className="space-y-4">
                      {currentPaper.sections.map((section, index) => (
                        <div key={section.id} className="border-l-4 border-green-500 pl-4 py-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-lg">
                              Section {index + 1}: {section.title}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>{section.marks} marks</span>
                              {section.timeLimit && <span>{section.timeLimit} min</span>}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">{section.instructions}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FiFileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>No sections added yet.</p>
                      <p className="text-sm">Use the form to add sections to your paper.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="text-center py-12 text-gray-500">
                  <FiFileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No Paper Selected</h3>
                  <p>Create a new paper to start building your examination.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "manage" && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Saved Papers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers.map((paper) => (
              <div key={paper.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg">{paper.title}</h3>
                  <button
                    onClick={() => deletePaper(paper.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{paper.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{paper.sections.length} sections</span>
                  <span>{paper.totalMarks} marks</span>
                  <span>{paper.duration} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={clsx("px-2 py-1 rounded text-xs font-medium", getStatusColor(paper.status))}>
                    {paper.status}
                  </span>
                  <button
                    onClick={() => setCurrentPaper(paper)}
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PaperBuilderApp
