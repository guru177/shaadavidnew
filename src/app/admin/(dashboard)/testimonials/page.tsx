"use client";

import React, { useState, useEffect } from 'react';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      setTestimonials(data);
    } catch (error) {
      console.error("Failed to fetch testimonials", error);
    }
    setIsLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    
    try {
      await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role, content, rating }),
      });
      
      // Reset form & refresh
      setName('');
      setRole('');
      setContent('');
      setRating(5);
      fetchTestimonials();
    } catch (error) {
      console.error("Failed to add testimonial", error);
    }
    
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' });
      fetchTestimonials();
    } catch (error) {
      console.error("Failed to delete testimonial", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-2xl font-bold text-[#0c1622]">Manage Testimonials</h1>
        <p className="text-gray-500 mt-1">Add, edit, or remove customer reviews shown on the homepage.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add New Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
            <h2 className="text-lg font-bold text-[#0c1622] mb-6">Add New Testimonial</h2>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Customer Name</label>
                <input required type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80] outline-none transition-all text-sm" placeholder="e.g. Rahul Krishnan" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role / Designation</label>
                <input required type="text" value={role} onChange={e=>setRole(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80] outline-none transition-all text-sm" placeholder="e.g. Student, Kochi" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rating (1-5)</label>
                <input required type="number" min="1" max="5" value={rating} onChange={e=>setRating(Number(e.target.value))} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80] outline-none transition-all text-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Review Content</label>
                <textarea required rows={4} value={content} onChange={e=>setContent(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80] outline-none transition-all text-sm resize-none" placeholder="What did they say?"></textarea>
              </div>

              <button disabled={isAdding} type="submit" className="w-full py-3 bg-[#0c1622] hover:bg-[#29425e] text-white rounded-xl font-bold transition-all disabled:opacity-70">
                {isAdding ? 'Adding...' : 'Publish Testimonial'}
              </button>
            </form>
          </div>
        </div>

        {/* Existing List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#0c1622]">Published Testimonials</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {isLoading ? (
                <div className="p-8 text-center text-gray-500">Loading testimonials...</div>
              ) : testimonials.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No testimonials found. Add one!</div>
              ) : (
                testimonials.map((t, i) => (
                  <div key={i} className="p-6 hover:bg-gray-50 transition-colors flex gap-6">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                      {t.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-[#0c1622]">{t.name}</h3>
                          <p className="text-xs text-gray-500 font-medium">{t.role} • {t.date}</p>
                        </div>
                        <div className="flex gap-1 text-amber-400">
                          {[...Array(t.rating)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-gray-600 leading-relaxed">"{t.content}"</p>
                      
                      <div className="mt-4 flex gap-4">
                        <button onClick={() => handleDelete(t.id)} className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors">Delete</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
