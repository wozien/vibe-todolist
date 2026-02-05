"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Trash2,
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  Sparkles,
  Trash,
  Edit2,
  Flag,
} from "lucide-react";

type Priority = "high" | "medium" | "low";

interface Todo {
  id: string;
  content: string;
  completed: boolean;
  priority: Priority;
  createdAt: Date;
}

const PRIORITY_CONFIG = {
  high: { label: "高", color: "bg-red-100 text-red-700", icon: "🔴" },
  medium: { label: "中", color: "bg-yellow-100 text-yellow-700", icon: "🟡" },
  low: { label: "低", color: "bg-green-100 text-green-700", icon: "🟢" },
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [mounted, setMounted] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<Priority>("medium");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedTodos = localStorage.getItem("vibe-todos");
    if (savedTodos) {
      try {
        const parsed = JSON.parse(savedTodos);
        setTodos(
          parsed.map((todo: any) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
          })),
        );
      } catch (e) {
        console.error("Failed to parse todos:", e);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("vibe-todos", JSON.stringify(todos));
    }
  }, [todos, mounted]);

  const addTodo = useCallback(() => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        content: inputValue.trim(),
        completed: false,
        priority: selectedPriority,
        createdAt: new Date(),
      };
      setTodos((prev) => [newTodo, ...prev]);
      setInputValue("");
      setSelectedPriority("medium");
      inputRef.current?.focus();
    }
  }, [inputValue, selectedPriority]);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, []);

  const clearAll = useCallback(() => {
    setTodos([]);
    setShowClearAllConfirm(false);
  }, []);

  const startEdit = useCallback((todo: Todo) => {
    setEditingId(todo.id);
    setEditingContent(todo.content);
  }, []);

  const saveEdit = useCallback(() => {
    if (editingId && editingContent.trim()) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === editingId
            ? { ...todo, content: editingContent.trim() }
            : todo,
        ),
      );
    }
    setEditingId(null);
    setEditingContent("");
  }, [editingId, editingContent]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditingContent("");
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.length - completedCount;

  if (!mounted) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-pulse text-primary-500">加载中...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-700 mb-2 flex items-center justify-center gap-3">
            <Sparkles className="text-purple-400" size={36} />
            我的待办清单
            <Sparkles className="text-purple-400" size={36} />
          </h1>
          <p className="text-primary-500">管理您的每日任务</p>
        </div>

        <div className="glass rounded-3xl shadow-soft p-6 sm:p-8 mb-6">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="今天要做什么？"
                className="flex-1 px-5 py-3 rounded-2xl border-2 border-primary-200 
                         focus:border-primary-400 focus:outline-none transition-all duration-300
                         text-slate-700 placeholder:text-primary-400
                         shadow-sm focus:shadow-md bg-white"
              />
              <button
                onClick={addTodo}
                disabled={!inputValue.trim()}
                className="px-4 py-3 bg-primary-500 text-white rounded-2xl
                         hover:bg-primary-600 active:scale-95 transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <Plus size={24} />
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-slate-500">优先级：</span>
              {(["low", "medium", "high"] as Priority[]).map((priority) => (
                <button
                  key={priority}
                  onClick={() => setSelectedPriority(priority)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300
                           ${
                             selectedPriority === priority
                               ? "ring-2 ring-offset-2 ring-primary-400"
                               : ""
                           } ${PRIORITY_CONFIG[priority].color}`}
                >
                  {PRIORITY_CONFIG[priority].icon}{" "}
                  {PRIORITY_CONFIG[priority].label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full">
              <Circle size={16} className="text-primary-500" />
              <span className="text-primary-700 font-medium">
                {activeCount} 未完成
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
              <CheckCircle2 size={16} className="text-green-600" />
              <span className="text-green-700 font-medium">
                {completedCount} 已完成
              </span>
            </div>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 
                         hover:bg-purple-200 rounded-full transition-all duration-300
                         font-medium"
              >
                <Trash size={16} />
                <span>清空已完成</span>
              </button>
            )}
            {todos.length > 0 && (
              <button
                onClick={() => setShowClearAllConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 
                         hover:bg-red-200 rounded-full transition-all duration-300
                         font-medium"
              >
                <Trash size={16} />
                <span>全部清空</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="glass rounded-3xl shadow-soft p-12 text-center">
              <div
                className="inline-flex items-center justify-center w-20 h-20 
                            bg-linear-to-br from-primary-100 to-purple-100 rounded-full mb-6"
              >
                <Sparkles className="text-purple-400" size={40} />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                🎉 任务全部完成！
              </h3>
              <p className="text-slate-500 mb-4">
                {todos.length === 0 && completedCount > 0
                  ? "太棒了，你已经完成了所有任务"
                  : "开始添加你的第一个任务吧"}
              </p>
              <button
                onClick={() => inputRef.current?.focus()}
                className="px-6 py-2 bg-primary-500 text-white rounded-full
                         hover:bg-primary-600 transition-all duration-300
                         shadow-md hover:shadow-lg"
              >
                ✨ 添加新任务
              </button>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`glass rounded-2xl p-4 sm:p-5 transition-all duration-300 
                          shadow-sm hover:shadow-md group
                          ${todo.completed ? "opacity-75" : ""}`}
                style={{
                  backgroundColor: todo.completed
                    ? "rgba(14, 165, 233, 0.08)"
                    : "rgba(255, 255, 255, 0.75)",
                  borderLeft: `4px solid ${
                    todo.completed
                      ? "#94a3b8"
                      : todo.priority === "high"
                        ? "#ef4444"
                        : todo.priority === "medium"
                          ? "#eab308"
                          : "#22c55e"
                  }`,
                }}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`shrink-0 transition-all duration-300
                             ${
                               todo.completed
                                 ? "text-green-500 scale-110"
                                 : "text-primary-300 hover:text-primary-500 hover:scale-110"
                             }`}
                  >
                    {todo.completed ? (
                      <CheckCircle2 size={26} />
                    ) : (
                      <Circle size={26} />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    {editingId === todo.id ? (
                      <input
                        type="text"
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        onKeyDown={handleEditKeyDown}
                        onBlur={saveEdit}
                        autoFocus
                        className="w-full px-3 py-1 rounded-lg border-2 border-primary-300 
                                 focus:border-primary-500 focus:outline-none text-slate-700
                                 bg-white"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex-1 text-slate-700 transition-all duration-300 truncate
                                        ${
                                          todo.completed
                                            ? "line-through text-slate-400"
                                            : ""
                                        }`}
                        >
                          {todo.content}
                        </span>
                        <span
                          className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium
                                     ${PRIORITY_CONFIG[todo.priority].color}`}
                        >
                          {PRIORITY_CONFIG[todo.priority].icon}{" "}
                          {PRIORITY_CONFIG[todo.priority].label}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {!todo.completed && editingId !== todo.id && (
                      <button
                        onClick={() => startEdit(todo)}
                        className="shrink-0 px-3 py-2 text-slate-400 
                                 hover:text-blue-500 hover:bg-blue-50 rounded-xl
                                 transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <Edit2 size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="shrink-0 px-3 py-2 text-slate-400 
                               hover:text-red-500 hover:bg-red-50 rounded-xl
                               transition-all duration-300 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {todos.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-primary-500 text-sm">共 {todos.length} 个任务</p>
          </div>
        )}

        {showClearAllConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass rounded-3xl p-6 sm:p-8 max-w-sm mx-auto">
              <div className="text-center">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 
                              bg-red-100 rounded-full mb-4"
                >
                  <Trash className="text-red-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">
                  确认清空全部？
                </h3>
                <p className="text-slate-500 mb-6">
                  此操作不可逆，所有任务都将被删除。
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowClearAllConfirm(false)}
                    className="px-6 py-2 bg-slate-200 text-slate-700 rounded-full
                             hover:bg-slate-300 transition-all duration-300 font-medium"
                  >
                    取消
                  </button>
                  <button
                    onClick={clearAll}
                    className="px-6 py-2 bg-red-500 text-white rounded-full
                             hover:bg-red-600 transition-all duration-300 font-medium"
                  >
                    确认清空
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
