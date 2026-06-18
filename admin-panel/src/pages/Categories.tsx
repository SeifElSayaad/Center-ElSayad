import { useEffect, useState, useRef } from 'react';
import apiClient from '../api/apiClient';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit, X, Save, Loader2, Search, Tag } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  _count?: { products: number };
}

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  sortOrder: string;
  isActive: boolean;
}

const emptyForm: CategoryForm = {
  name: '',
  slug: '',
  description: '',
  sortOrder: '0',
  isActive: true,
};

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\\s-]/g, '')
    .trim()
    .replace(/\\s+/g, '-');
}

// ─── Category Modal ───────────────────────────────────────────────────────────

interface CategoryModalProps {
  category: Category | null;
  onClose: () => void;
  onSaved: () => void;
}

function CategoryModal({ category, onClose, onSaved }: CategoryModalProps) {
  const isEdit = category !== null;
  const [form, setForm] = useState<CategoryForm>(
    isEdit
      ? {
          name: category.name,
          slug: category.slug,
          description: category.description ?? '',
          sortOrder: String(category.sortOrder),
          isActive: category.isActive,
        }
      : emptyForm
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof CategoryForm, value: string | boolean) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (!isEdit && field === 'name' && typeof value === 'string') {
        updated.slug = toSlug(value);
      }
      return updated;
    });
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.slug.trim()) errs.slug = 'Slug is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name.trim());
      formData.append('slug', form.slug.trim());
      if (form.description.trim()) formData.append('description', form.description.trim());
      formData.append('sortOrder', form.sortOrder);
      formData.append('isActive', String(form.isActive));
      if (imageFile) formData.append('image', imageFile);

      if (isEdit) {
        await apiClient.put(`/categories/${category.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Category updated');
      } else {
        await apiClient.post('/categories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Category created');
      }

      onSaved();
      onClose();
    } catch (err: unknown) {
      const errAny = err as { response?: { data?: { error?: string; details?: { field: string; message: string }[] } } };
      const details = errAny?.response?.data?.details;
      if (details) {
        const fieldErrors: Record<string, string> = {};
        details.forEach((d) => { fieldErrors[d.field] = d.message; });
        setErrors(fieldErrors);
      } else {
        toast.error(errAny?.response?.data?.error ?? 'Failed to save category');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`block w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="e.g. School Supplies"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              className={`block w-full rounded-lg border px-3 py-2 text-sm font-mono bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.slug ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="school-supplies"
            />
            {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              placeholder="Optional description..."
            />
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort Order</label>
            <input
              type="number"
              min="0"
              value={form.sortOrder}
              onChange={(e) => handleChange('sortOrder', e.target.value)}
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category Image</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => { if (e.target.files?.[0]) setImageFile(e.target.files[0]); }}
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {imageFile ? (
              <p className="mt-1 text-xs text-gray-500">Selected: {imageFile.name}</p>
            ) : category?.imageUrl ? (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                <img
                  src={category.imageUrl}
                  alt="Current"
                  className="h-16 w-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            ) : null}
          </div>

          {/* Active Toggle */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active (visible to customers)</span>
            </label>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{ backgroundColor: 'var(--color-brand)' }}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white rounded-lg hover:brightness-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isEdit ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Categories Page ─────────────────────────────────────────────────────

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalState, setModalState] = useState<'closed' | 'new' | Category>('closed');

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/categories?includeInactive=true&withStats=true');
      setCategories(res.data);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"? This cannot be undone.`)) return;
    try {
      await apiClient.delete(`/categories/${id}`);
      toast.success('Category deleted');
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err: unknown) {
      const errAny = err as { response?: { data?: { error?: string } } };
      toast.error(errAny?.response?.data?.error ?? 'Failed to delete category');
    }
  };

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Modal */}
      {modalState !== 'closed' && (
        <CategoryModal
          category={modalState === 'new' ? null : (modalState as Category)}
          onClose={() => setModalState('closed')}
          onSaved={fetchCategories}
        />
      )}

      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {categories.length} total categor{categories.length !== 1 ? 'ies' : 'y'}
          </p>
        </div>
        <button
          onClick={() => setModalState('new')}
          style={{ backgroundColor: 'var(--color-brand)' }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:brightness-90 transition-all"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <div className="relative rounded-md shadow-sm max-w-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 sm:text-sm rounded-md py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading categories...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Products</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {c.imageUrl ? (
                          <img
                            src={c.imageUrl}
                            alt={c.name}
                            className="h-10 w-10 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <Tag className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{c.name}</div>
                          {c.description && (
                            <div className="text-xs text-gray-400 truncate max-w-48">{c.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-400">{c.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {c._count?.products ?? 0} product{(c._count?.products ?? 0) !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{c.sortOrder}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {c.isActive ? (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Active</span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setModalState(c)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.name)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      {search ? `No categories match "${search}"` : 'No categories yet. Click "Add Category" to get started.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

