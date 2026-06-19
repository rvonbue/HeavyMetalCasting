import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { PageContainer, AdminPageHeader } from '../../components/Resuables';
import { TrashIcon, PencilIcon } from '../../styles/Icons';
import Modal from '../../components/modal/Modal';
import { addEvent, updateEvent, removeEvent } from '../../store/eventsSlice';
import RichTextEditor from '../../components/RichTextEditor';
import {
  createEventAPI,
  updateEventAPI,
  deleteEventAPI,
  uploadEventImageAPI,
  deleteSiteImageAPI,
} from '../../api/eventsAPI';

const inputClass = "w-full bg-hmc-panelbackground text-hmc-textprimary text-sm px-3 py-2 border border-hmc-border-b focus:outline-none focus:border-hmc-border-a";

function EventForm({ initial = {}, onSave, onCancel, saving }) {
  const [title, setTitle] = useState(initial.title ?? '');
  const [description, setDescription] = useState(initial.description ?? '');
  const [url, setUrl] = useState(initial.url ?? '');
  const [active, setActive] = useState(initial.active ?? true);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(initial.image?.image_url ?? null);
  const fileRef = useRef();

  function onFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    setImageFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({ title, description, url, active, imageFile, existingImageId: initial.image?.id, existingImagePath: initial.image?.image_path });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-bold text-hmc-textprimary uppercase mb-1 block">Title</label>
        <input className={inputClass} value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div>
        <label className="text-xs font-bold text-hmc-textprimary uppercase mb-1 block">Description</label>
        <RichTextEditor value={description} onChange={setDescription} placeholder="Enter event description…" />
      </div>
      <div>
        <label className="text-xs font-bold text-hmc-textprimary uppercase mb-1 block">Link URL</label>
        <input className={inputClass} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://" />
      </div>
      <div>
        <label className="text-xs font-bold text-hmc-textprimary uppercase mb-1 block">Image</label>
        {preview && <img src={preview} alt="preview" className="mb-2 max-h-40 object-contain border border-hmc-border-b" />}
        <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
        <button type="button" onClick={() => fileRef.current.click()} className="text-xs border border-hmc-border-b px-3 py-1 text-hmc-textprimary hover:border-hmc-border-a">
          {preview ? 'Replace image' : 'Upload image'}
        </button>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="active" checked={active} onChange={e => setActive(e.target.checked)} className="cursor-pointer accent-hmc-textprimary" />
        <label htmlFor="active" className="text-sm text-hmc-textprimary">Active</label>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm border border-hmc-border-a text-hmc-textprimary hover:bg-hmc-button-a/20">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-hmc-button-a text-hmc-button-text-a font-bold hover:opacity-90 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export default function EventOverviewPage() {
  const dispatch = useDispatch();
  const events = useSelector(state => state.events.events);

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSave({ title, description, url, active, imageFile, existingImageId, existingImagePath }) {
    setSaving(true);
    try {
      let image_id = editTarget?.image_id ?? null;

      if (imageFile) {
        if (existingImageId) await deleteSiteImageAPI(existingImageId, existingImagePath);
        const img = await uploadEventImageAPI(imageFile);
        image_id = img.id;
      }

      if (editTarget) {
        const updated = await updateEventAPI(editTarget.id, { title, description, url, active, image_id });
        dispatch(updateEvent(updated));
        toast.success('Event updated');
      } else {
        const created = await createEventAPI({ title, description, url, active, image_id, sort_order: events.length });
        dispatch(addEvent(created));
        toast.success('Event created');
      }

      setShowForm(false);
      setEditTarget(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save event');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteEventAPI(deleteTarget.id);
      dispatch(removeEvent(deleteTarget.id));
      toast.success('Event deleted');
    } catch (err) {
      toast.error('Failed to delete event');
    } finally {
      setDeleteTarget(null);
    }
  }

  function openEdit(event) {
    setEditTarget(event);
    setShowForm(true);
  }

  function openAdd() {
    setEditTarget(null);
    setShowForm(true);
  }

  return (
    <PageContainer bg="alt1">
      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditTarget(null); }} title={editTarget ? 'Edit Event' : 'Add Event'} maxWidth="max-w-lg">
        <EventForm
          initial={editTarget ?? {}}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditTarget(null); }}
          saving={saving}
        />
      </Modal>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Event"
        maxWidth="max-w-sm"
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm border border-hmc-border-a text-hmc-textprimary hover:bg-hmc-button-a/20">Cancel</button>
            <button onClick={handleDelete} className="px-4 py-2 text-sm bg-red-600 text-white font-bold hover:bg-red-700">Delete</button>
          </>
        }
      >
        <p className="text-sm text-gray-600">Delete <span className="font-semibold text-gray-900">{deleteTarget?.title}</span>? This cannot be undone.</p>
      </Modal>

      <div className="mx-auto rounded bg-white p-4 shadow">
        <AdminPageHeader
          title="Event Overview"
          action={
            <button onClick={openAdd} className="px-4 py-2 text-sm bg-hmc-button-a text-hmc-button-text-a font-bold hover:opacity-90">
              + Add Event
            </button>
          }
        />

        {events.length === 0 ? (
          <p className="text-sm text-hmc-textprimary">No events yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-hmc-border-b">
            {events.map(event => (
              <div key={event.id} className="flex items-center gap-4 py-4">
                {event.image ? (
                  <img src={event.image.image_url} alt={event.title} className="w-20 h-16 object-cover border border-hmc-border-b shrink-0" />
                ) : (
                  <div className="w-20 h-16 bg-hmc-button-a/20 border border-hmc-border-b shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-hmc-textprimary truncate">{event.title}</div>
                  {event.description && <p className="text-xs text-hmc-textsecondary line-clamp-2 mt-0.5">{event.description}</p>}
                  {event.url && <a href={event.url} target="_blank" rel="noopener noreferrer" className="text-xs text-hmc-b hover:underline truncate block mt-0.5">{event.url}</a>}
                </div>
                <span className={`text-xs px-2 py-0.5 ${event.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {event.active ? 'Active' : 'Inactive'}
                </span>
                <div className="flex gap-3 shrink-0">
                  <button onClick={() => openEdit(event)} className="text-hmc-textprimary hover:text-hmc-b transition"><PencilIcon /></button>
                  <button onClick={() => setDeleteTarget(event)} className="text-hmc-textprimary hover:text-hmc-error transition"><TrashIcon /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
