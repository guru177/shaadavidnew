"use client";

import React, { useState, useEffect } from 'react';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    }
    setIsLoading(false);
  };

  const handleAddOrEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    
    try {
      let finalImageUrl = image;

      // Handle file upload if a file was selected
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          finalImageUrl = uploadData.url;
        }
      }

      if (editingId) {
        // Edit Mode
        await fetch('/api/blogs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, title, category, excerpt, content, image: finalImageUrl }),
        });
      } else {
        // Add Mode
        await fetch('/api/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, category, excerpt, content, image: finalImageUrl }),
        });
      }
      
      // Reset form & refresh
      setTitle(''); setCategory(''); setExcerpt(''); setContent(''); setImage(''); setFile(null);
      setEditingId(null);
      setShowForm(false);
      fetchBlogs();
    } catch (error) {
      console.error("Failed to save blog", error);
    }
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      await fetch(`/api/blogs?id=${id}`, { method: 'DELETE' });
      fetchBlogs();
    } catch (error) {
      console.error("Failed to delete blog", error);
    }
  };

  const handleEditClick = (blog: any) => {
    setEditingId(blog.id);
    setTitle(blog.title);
    setCategory(blog.category);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setImage(blog.image);
    setFile(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0c1622]">Manage Blogs</h1>
          <p className="text-gray-500 mt-1">Create and publish new articles to your audience.</p>
        </div>
        <button 
          onClick={() => {
            if (showForm) {
              setEditingId(null);
              setTitle(''); setCategory(''); setExcerpt(''); setContent(''); setImage(''); setFile(null);
            }
            setShowForm(!showForm);
          }}
          className="px-6 py-3 bg-[linear-gradient(110deg,#29425e_0%,#395c80_100%)] text-white rounded-xl font-bold hover:shadow-lg transition-all"
        >
          {showForm ? 'Cancel' : '+ Write New Post'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 animate-[modalFadeIn_0.3s_ease-out]">
          <h2 className="text-xl font-bold text-[#0c1622] mb-6">{editingId ? 'Edit Blog Post' : 'Write a New Blog Post'}</h2>
          <form onSubmit={handleAddOrEdit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Post Title</label>
                <input required type="text" value={title} onChange={e=>setTitle(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80] outline-none transition-all text-sm" placeholder="Enter title (Malayalam or English)" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category / Tag</label>
                <input required type="text" value={category} onChange={e=>setCategory(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80] outline-none transition-all text-sm" placeholder="e.g. Vocabulary, Grammar" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
              <div className="flex gap-4 items-center">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#29425e]/10 file:text-[#29425e] hover:file:bg-[#29425e]/20"
                />
                <span className="text-gray-400 font-bold text-sm">OR</span>
                <input 
                  type="url" 
                  value={image} 
                  onChange={e=>setImage(e.target.value)} 
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80] outline-none transition-all text-sm" 
                  placeholder="Paste image URL here" 
                  required={!file && !image}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Short Excerpt (Shown on cards)</label>
              <textarea required rows={2} value={excerpt} onChange={e=>setExcerpt(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80] outline-none transition-all text-sm resize-none" placeholder="A brief summary..."></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Content</label>
              <textarea required rows={8} value={content} onChange={e=>setContent(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80] outline-none transition-all text-sm resize-none" placeholder="Write the full article here..."></textarea>
            </div>

            <button disabled={isAdding} type="submit" className="px-8 py-3.5 bg-[#0c1622] hover:bg-[#29425e] text-white rounded-xl font-bold transition-all disabled:opacity-70">
              {isAdding ? 'Saving...' : (editingId ? 'Update Post' : 'Publish Post')}
            </button>
          </form>
        </div>
      )}

      {/* Published Posts Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#0c1622]">Published Posts ({blogs.length})</h2>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading blogs...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No blogs published yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Cover</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Title & Excerpt</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Category</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                        <img src={blog.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-sm">
                      <div className="font-bold text-[#0c1622] truncate">{blog.title}</div>
                      <div className="text-xs text-gray-500 truncate mt-1">{blog.excerpt}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-[#29425e]/10 text-[#29425e] rounded font-semibold text-xs">{blog.category}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-medium text-gray-600">{blog.date}</div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => handleEditClick(blog)} className="text-sm font-semibold text-[#395c80] hover:text-[#0c1622] transition-colors">Edit</button>
                        <button onClick={() => handleDelete(blog.id)} className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
