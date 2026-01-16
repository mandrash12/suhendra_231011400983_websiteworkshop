
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { taskService } from './services/TaskService';
import { Task, TaskCategory, TaskStatus } from './types';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.PERSONAL);
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | TaskStatus>('all');

  const refreshTasks = useCallback(() => {
    setTasks(taskService.getTasks());
  }, []);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => t.status === TaskStatus.PENDING).length,
    completed: tasks.filter(t => t.status === TaskStatus.COMPLETED).length
  }), [tasks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      taskService.createTask({ title, description, category, dueDate });
      setTitle('');
      setDescription('');
      setDueDate('');
      refreshTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggle = (id: string) => {
    taskService.toggleStatus(id);
    refreshTasks();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Remove this task?')) {
      taskService.deleteTask(id);
      refreshTasks();
    }
  };

  const filteredTasks = tasks.filter(t => filter === 'all' || t.status === filter);

  const getCategoryStyles = (cat: TaskCategory) => {
    switch(cat) {
      case TaskCategory.WORK: return 'bg-blue-100/50 text-blue-700 border-blue-200';
      case TaskCategory.PERSONAL: return 'bg-emerald-100/50 text-emerald-700 border-emerald-200';
      case TaskCategory.STUDY: return 'bg-violet-100/50 text-violet-700 border-violet-200';
      case TaskCategory.URGENT: return 'bg-rose-100/50 text-rose-700 border-rose-200';
      default: return 'bg-slate-100/50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Dynamic Background Header */}
      <div className="absolute top-0 left-0 w-full h-[400px] mesh-gradient -z-10 shadow-2xl"></div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="mb-12 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter flex items-center gap-4">
              <span className="bg-white/20 p-2 rounded-2xl backdrop-blur-md border border-white/30 shadow-inner">
                <i className="fas fa-layer-group text-white"></i>
              </span>
              TASK MASTER PRO
            </h1>
            <p className="text-indigo-100 font-medium opacity-90 text-lg">
              Clean Architecture <span className="opacity-40">/</span> Enterprise Grade
            </p>
          </div>
          <div className="flex gap-4">
            <div className="glass px-6 py-3 rounded-3xl border border-white/40 shadow-xl">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] block text-indigo-900/40 mb-1">Infrastructure</span>
              <span className="font-bold flex items-center gap-2 text-indigo-950">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                </span>
                Active System
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Tasks', val: stats.total, icon: 'fa-list-ul', gradient: 'from-indigo-500 to-blue-600' },
            { label: 'Pending', val: stats.pending, icon: 'fa-clock', gradient: 'from-amber-400 to-orange-500' },
            { label: 'Completed', val: stats.completed, icon: 'fa-check-circle', gradient: 'from-emerald-400 to-teal-600' },
            { label: 'Efficiency', val: stats.total ? Math.round((stats.completed / stats.total) * 100) + '%' : '0%', icon: 'fa-chart-line', gradient: 'from-violet-500 to-purple-600' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 group transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <span className="text-3xl font-black text-slate-800 tracking-tight">{item.val}</span>
              </div>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Sidebar: Creation Form */}
          <aside className="lg:col-span-4">
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-white sticky top-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <i className="fas fa-bolt"></i>
                </div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Quick Add</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="group">
                  <label className="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-wider">Project Title</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 rounded-[1.5rem] border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all p-5 text-sm outline-none shadow-inner group-hover:bg-slate-100 focus:shadow-indigo-100"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-wider">Category</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-slate-50 rounded-[1.5rem] border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all p-5 text-sm outline-none appearance-none cursor-pointer shadow-inner"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as TaskCategory)}
                      >
                        {Object.values(TaskCategory).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <i className="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-xs"></i>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-wider">Deadline</label>
                    <input 
                      type="date" 
                      className="w-full bg-slate-50 rounded-[1.5rem] border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all p-5 text-sm outline-none shadow-inner"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-wider">Context & Notes</label>
                  <textarea 
                    className="w-full bg-slate-50 rounded-[1.5rem] border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all p-5 text-sm outline-none resize-none shadow-inner"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add more details..."
                  />
                </div>

                {error && (
                  <div className="bg-rose-50 border-2 border-rose-100 text-rose-600 p-5 rounded-[1.5rem] text-xs font-bold flex items-center gap-3 animate-pulse">
                    <i className="fas fa-exclamation-triangle text-lg"></i>
                    {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 text-white py-5 px-6 rounded-[1.5rem] hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-300 transition-all font-black text-sm flex items-center justify-center gap-3 active:scale-[0.98] shadow-lg shadow-indigo-100"
                >
                  COMMIT TASK
                  <i className="fas fa-plus-circle"></i>
                </button>
              </form>
            </div>
          </aside>

          {/* Main Content: List */}
          <main className="lg:col-span-8">
            <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8 bg-gradient-to-r from-slate-50/50 to-white">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">Active Logs</h2>
                  <p className="text-slate-400 font-bold text-sm mt-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                    Synchronized with Repository
                  </p>
                </div>
                <div className="flex bg-slate-100 p-2 rounded-[1.5rem] border-2 border-slate-200/50">
                  {[
                    { key: 'all', label: 'Overview' },
                    { key: TaskStatus.PENDING, label: 'Queue' },
                    { key: TaskStatus.COMPLETED, label: 'Success' }
                  ].map((btn) => (
                    <button 
                      key={btn.key}
                      onClick={() => setFilter(btn.key as any)}
                      className={`px-6 py-2.5 rounded-[1.1rem] text-[11px] font-black uppercase tracking-widest transition-all ${filter === btn.key ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-100' : 'text-slate-400 hover:text-indigo-600'}`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-8 space-y-6">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-40 px-10">
                    <div className="w-24 h-24 bg-indigo-50 text-indigo-200 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                      <i className="fas fa-feather-pointed text-4xl"></i>
                    </div>
                    <h3 className="text-2xl font-black text-slate-700 tracking-tight">Awaiting Input</h3>
                    <p className="text-slate-400 font-medium max-w-xs mx-auto mt-3">The inventory is currently empty. Start by initializing a new task.</p>
                  </div>
                ) : (
                  filteredTasks.map(task => (
                    <div 
                      key={task.id} 
                      className={`task-card group p-6 bg-white rounded-[2rem] border-2 border-slate-50 flex items-start gap-6 ${task.status === TaskStatus.COMPLETED ? 'bg-slate-50/50 opacity-75' : 'hover:border-indigo-100'}`}
                    >
                      <button 
                        onClick={() => handleToggle(task.id)}
                        className={`mt-1 h-8 w-8 rounded-2xl border-2 flex items-center justify-center shrink-0 transition-all ${task.status === TaskStatus.COMPLETED ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'border-slate-200 text-transparent hover:border-indigo-400 hover:bg-indigo-50'}`}
                      >
                        <i className="fas fa-check text-xs"></i>
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className={`font-black text-xl tracking-tight truncate ${task.status === TaskStatus.COMPLETED ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {task.title}
                          </h3>
                          <button 
                            onClick={() => handleDelete(task.id)}
                            className="text-slate-200 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 p-2 hover:bg-rose-50 rounded-xl"
                          >
                            <i className="fas fa-trash-can text-lg"></i>
                          </button>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 mt-4">
                          <span className={`text-[10px] px-4 py-1.5 rounded-xl font-black uppercase tracking-widest border-2 ${getCategoryStyles(task.category)} shadow-sm`}>
                            {task.category}
                          </span>
                          <span className="text-[11px] font-black text-slate-400 flex items-center gap-2.5">
                            <i className="fas fa-calendar-day text-slate-300"></i>
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { day:'numeric', month:'short', year:'numeric' }) : 'Continuous'}
                          </span>
                        </div>

                        {task.description && (
                          <div className="mt-5 relative">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-100 rounded-full"></div>
                            <p className="text-slate-500 text-sm pl-5 leading-relaxed font-medium">
                              {task.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      <footer className="py-16 text-center">
        <div className="flex justify-center gap-6 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors border border-slate-100"><i className="fab fa-github text-xl"></i></div>
          <div className="w-12 h-12 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors border border-slate-100"><i className="fas fa-shield-halved text-xl"></i></div>
          <div className="w-12 h-12 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors border border-slate-100"><i className="fas fa-code text-xl"></i></div>
        </div>
        <div className="inline-block px-8 py-4 bg-white/50 backdrop-blur rounded-[2rem] border border-white">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
            <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
            TMS Enterprise • Clean Logic Verified • High Modularity
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
