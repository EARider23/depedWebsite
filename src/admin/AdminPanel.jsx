import React, { useState, useEffect } from 'react'
import { defaultConfig } from '../data/defaultConfig'
import { Save, Download, Upload, Trash2, Plus, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AdminPanel() {
  const [config, setConfig] = useState(defaultConfig)
  const [activeTab, setActiveTab] = useState('version')
  const [saveStatus, setSaveStatus] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('peeak_site_config')
    if (stored) {
      try {
        setConfig(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse stored config", e)
      }
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('peeak_site_config', JSON.stringify(config))
    setSaveStatus('Saved successfully!')
    setTimeout(() => setSaveStatus(''), 3000)
  }

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "peeak_site_config.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const handleImport = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target.result)
          setConfig(importedConfig)
          setSaveStatus('Imported successfully! Remember to save.')
          setTimeout(() => setSaveStatus(''), 3000)
        } catch (error) {
          alert("Invalid JSON file")
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-[#d4d4d8] font-sans p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Website
            </Link>
            <h1 className="text-3xl font-black text-white">PEEAK Admin Panel</h1>
            <p className="text-gray-500">Manage website content locally.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 text-sm font-bold">{saveStatus}</span>
            <label className="cursor-pointer px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg flex items-center gap-2 text-sm border border-white/10 transition-colors">
              <Upload className="w-4 h-4" /> Import
              <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            </label>
            <button onClick={handleExport} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg flex items-center gap-2 text-sm border border-white/10 transition-colors">
              <Download className="w-4 h-4" /> Export
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg flex items-center gap-2 text-sm font-bold transition-colors">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden flex border border-white/10 min-h-[600px]">
          {/* Sidebar */}
          <div className="w-64 bg-black/40 border-r border-white/5 p-4 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('version')}
              className={`px-4 py-3 rounded-lg text-left font-bold transition-colors ${activeTab === 'version' ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-white/5 text-gray-400'}`}
            >
              Version & Releases
            </button>
            <button 
              onClick={() => setActiveTab('downloads')}
              className={`px-4 py-3 rounded-lg text-left font-bold transition-colors ${activeTab === 'downloads' ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-white/5 text-gray-400'}`}
            >
              Download Links
            </button>
            <button 
              onClick={() => setActiveTab('changelog')}
              className={`px-4 py-3 rounded-lg text-left font-bold transition-colors ${activeTab === 'changelog' ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-white/5 text-gray-400'}`}
            >
              Changelog
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-8">
            {activeTab === 'version' && (
              <div className="space-y-6 max-w-md">
                <h2 className="text-xl font-bold text-white mb-6">Current Release Info</h2>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Version Number</label>
                  <input 
                    type="text" 
                    value={config.version} 
                    onChange={e => setConfig({...config, version: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Release Date</label>
                  <input 
                    type="date" 
                    value={config.releaseDate} 
                    onChange={e => setConfig({...config, releaseDate: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {activeTab === 'downloads' && (
              <div className="space-y-6 max-w-2xl">
                <h2 className="text-xl font-bold text-white mb-6">Direct Download Links</h2>
                {['macOS', 'Windows', 'Linux'].map(os => (
                  <div key={os}>
                    <label className="block text-sm font-bold text-gray-400 mb-2">{os} URL</label>
                    <input 
                      type="text" 
                      value={config.downloads[os]} 
                      onChange={e => setConfig({
                        ...config, 
                        downloads: { ...config.downloads, [os]: e.target.value }
                      })}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 font-mono text-sm"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'changelog' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Changelog Entries</h2>
                  <button 
                    onClick={() => {
                      const newEntry = { id: `v${Date.now()}`, version: "", date: "", type: "Feature", title: "", description: "" }
                      setConfig({...config, changelog: [newEntry, ...config.changelog]})
                    }}
                    className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded flex items-center gap-2 text-sm font-bold hover:bg-purple-500/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Entry
                  </button>
                </div>
                
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4">
                  {config.changelog.map((entry, index) => (
                    <div key={entry.id || index} className="bg-black/30 border border-white/5 rounded-xl p-4 relative group">
                      <button 
                        onClick={() => {
                          const newLogs = [...config.changelog]
                          newLogs.splice(index, 1)
                          setConfig({...config, changelog: newLogs})
                        }}
                        className="absolute top-4 right-4 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4 pr-8">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Version</label>
                          <input type="text" value={entry.version} onChange={e => {
                            const newLogs = [...config.changelog]
                            newLogs[index].version = e.target.value
                            setConfig({...config, changelog: newLogs})
                          }} className="w-full bg-black/50 border border-white/10 rounded px-3 py-1 text-sm text-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Date</label>
                          <input type="text" value={entry.date} onChange={e => {
                            const newLogs = [...config.changelog]
                            newLogs[index].date = e.target.value
                            setConfig({...config, changelog: newLogs})
                          }} className="w-full bg-black/50 border border-white/10 rounded px-3 py-1 text-sm text-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Type</label>
                          <select value={entry.type} onChange={e => {
                            const newLogs = [...config.changelog]
                            newLogs[index].type = e.target.value
                            setConfig({...config, changelog: newLogs})
                          }} className="w-full bg-black/50 border border-white/10 rounded px-3 py-1 text-sm text-white appearance-none">
                            <option value="Feature">Feature</option>
                            <option value="Fix">Fix</option>
                            <option value="Optimization">Optimization</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Title</label>
                        <input type="text" value={entry.title} onChange={e => {
                          const newLogs = [...config.changelog]
                          newLogs[index].title = e.target.value
                          setConfig({...config, changelog: newLogs})
                        }} className="w-full bg-black/50 border border-white/10 rounded px-3 py-1 text-sm text-white font-bold" />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                        <textarea value={entry.description} onChange={e => {
                          const newLogs = [...config.changelog]
                          newLogs[index].description = e.target.value
                          setConfig({...config, changelog: newLogs})
                        }} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white min-h-[80px]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
