import { useState, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { PageContainer, AdminPageHeader } from '../../components/Resuables';
import { TrashIcon, PencilIcon } from '../../styles/Icons';
import Modal from '../../components/modal/Modal';
import { addEvent, removeEvent } from '../../store/eventsSlice';
import RichTextEditor from '../../components/RichTextEditor';
import {
  createEventAPI,
  deleteEventAPI,
  uploadEventImageAPI,
  deleteSiteImageAPI,
} from '../../api/eventsAPI';

const inputClass = "w-full bg-hmc-panelbackground text-hmc-textprimary text-sm px-3 py-2 border border-hmc-border-b focus:outline-none focus:border-hmc-border-a";
const labelClass = "text-xs font-bold text-hmc-textprimary uppercase mb-1 block";

function EventForm({ onSave, onCancel, saving }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [active, setActive] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  function onFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    setImageFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      title, description, url, active,
      start_date: startDate || null,
      end_date: endDate || null,
      start_time: startTime || null,
      end_time: endTime || null,
      imageFile,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Title</label>
        <input className={inputClass} value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <RichTextEditor value={description} onChange={setDescription} placeholder="Enter event description…" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Start Date</label>
          <input type="date" className={inputClass} value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>End Date</label>
          <input type="date" className={inputClass} value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Start Time</label>
          <input type="time" className={inputClass} value={startTime} onChange={e => setStartTime(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>End Time</label>
          <input type="time" className={inputClass} value={endTime} onChange={e => setEndTime(e.target.value)} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Link URL</label>
        <input className={inputClass} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://" />
      </div>
      <div>
        <label className={labelClass}>Image</label>
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

function formatDate(val) {
  if (!val) return '—';
  return new Date(val + 'T00:00:00').toLocaleDateString();
}

function formatTime(val) {
  if (!val) return '—';
  const [h, m] = val.split(':');
  const d = new Date();
  d.setHours(+h, +m);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function EventOverviewPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const events = useSelector(state => state.events.events);

  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [sorting, setSorting] = useState([]);

  async function handleSave({ title, description, url, active, start_date, end_date, start_time, end_time, imageFile }) {
    setSaving(true);
    try {
      let image_id = null;
      if (imageFile) {
        const img = await uploadEventImageAPI(imageFile);
        image_id = img.id;
      }
      const created = await createEventAPI({ title, description, url, active, start_date, end_date, start_time, end_time, image_id, sort_order: events.length });
      dispatch(addEvent(created));
      toast.success('Event created');
      setShowForm(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to create event');
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

  function openAdd() { setShowForm(true); }


  const columns = useMemo(() => [
    {
      id: 'image',
      header: 'Image',
      enableSorting: false,
      size: 25,
      cell: ({ row }) => {
        const event = row.original;
        return event.image
          ? <img src={event.image.image_url} alt={event.title} className="w-full object-contain border border-hmc-border-b" style={{ minHeight: '150px' }} />
          : <div className="w-full bg-hmc-button-a/20 border border-hmc-border-b" style={{ minHeight: '150px' }} />;
      },
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ getValue }) => <span className="font-semibold text-hmc-textprimary">{getValue()}</span>,
    },
    {
      accessorKey: 'start_date',
      header: () => <span>Start<br/>Date</span>,
      meta: { align: 'center' },
      cell: ({ getValue }) => formatDate(getValue()),
    },
    {
      accessorKey: 'end_date',
      header: () => <span>End<br/>Date</span>,
      meta: { align: 'center' },
      cell: ({ getValue }) => formatDate(getValue()),
    },
    {
      accessorKey: 'start_time',
      header: () => <span>Start<br/>Time</span>,
      meta: { align: 'center' },
      cell: ({ getValue }) => formatTime(getValue()),
    },
    {
      accessorKey: 'end_time',
      header: () => <span>End<br/>Time</span>,
      meta: { align: 'center' },
      cell: ({ getValue }) => formatTime(getValue()),
    },
    {
      accessorKey: 'active',
      header: 'Status',
      meta: { align: 'center' },
      cell: ({ getValue }) => (
        <span className={`text-xs px-2 py-0.5 ${getValue() ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {getValue() ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      size: 0,
      meta: { align: 'right' },
      cell: ({ row }) => (
        <div className="flex gap-3 justify-end">
          <button onClick={() => navigate(`/admin/edit_event/${row.original.id}`)} className="text-hmc-textprimary hover:text-hmc-b transition"><PencilIcon /></button>
          <button onClick={() => setDeleteTarget(row.original)} className="text-hmc-textprimary hover:text-hmc-error transition"><TrashIcon /></button>
        </div>
      ),
    },
  ], []);

  const table = useReactTable({
    data: events,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <PageContainer bg="admin">
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add Event" maxWidth="max-w-lg">
        <EventForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
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

      <AdminPageHeader
        title="Event Overview"
        action={
          <button onClick={openAdd} className="px-4 py-2 text-sm bg-hmc-button-a text-hmc-button-text-a font-bold hover:opacity-90">
            + Add Event
          </button>
        }
      />

      <div className="overflow-hidden border border-hmc-border-a">
        <table className="w-full border-collapse text-sm table-fixed">
          <colgroup>
            <col style={{ width: '25%' }} />
            <col />
            <col style={{ width: '8rem' }} />
            <col style={{ width: '8rem' }} />
            <col style={{ width: '7rem' }} />
            <col style={{ width: '7rem' }} />
            <col style={{ width: '7rem' }} />
            <col style={{ width: '5rem' }} />
          </colgroup>
          <thead className="bg-hmc-button-a text-hmc-button-text-a">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(header => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={`px-3 py-3 text-xs font-bold uppercase tracking-wide border-b border-hmc-border-a ${canSort ? 'cursor-pointer select-none' : ''} text-${header.column.columnDef.meta?.align ?? 'left'}`}
                    >
                      <div className={`flex items-center gap-1 ${header.column.columnDef.meta?.align === 'center' ? 'justify-center' : header.column.columnDef.meta?.align === 'right' ? 'justify-end' : ''}`}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sorted === 'asc' && <span>▲</span>}
                        {sorted === 'desc' && <span>▼</span>}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr><td colSpan={8} className="px-3 py-6 text-center text-sm text-hmc-textprimary opacity-50">No events yet.</td></tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b border-hmc-border-b hover:bg-hmc-button-a/10 transition">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className={`px-3 py-3 align-middle text-hmc-textprimary text-${cell.column.columnDef.meta?.align ?? 'left'}`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}
