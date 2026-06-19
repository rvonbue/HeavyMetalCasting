import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { PageContainer, AdminPageHeader } from '../../components/Resuables';
import { updateEvent } from '../../store/eventsSlice';
import {
  updateEventAPI,
  uploadEventImageAPI,
  deleteSiteImageAPI,
} from '../../api/eventsAPI';

const inputClass = "w-full bg-hmc-panelbackground text-hmc-textprimary text-sm px-3 py-2 border border-hmc-border-b focus:outline-none focus:border-hmc-border-a";
const labelClass = "text-xs font-bold text-hmc-textprimary uppercase mb-1 block";

export default function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const event = useSelector(state => state.events.events.find(e => e.id === Number(id)));

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(event?.image?.image_url ?? null);
  const [deleteImage, setDeleteImage] = useState(false);
  const [imageDirty, setImageDirty] = useState(false);
  const fileRef = useRef();

  const { register, handleSubmit, control, formState: { isDirty, isSubmitting, errors } } = useForm({
    defaultValues: {
      title: event?.title ?? '',
      description: event?.description ?? '',
      url: event?.url ?? '',
      start_date: event?.start_date ?? '',
      end_date: event?.end_date ?? '',
      start_time: event?.start_time ?? '',
      end_time: event?.end_time ?? '',
      active: event?.active ?? true,
    },
  });

  if (!event) {
    return (
      <PageContainer bg="admin">
        <p className="text-sm text-hmc-textprimary">Event not found.</p>
      </PageContainer>
    );
  }

  function onFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    setImageFile(f);
    setPreview(URL.createObjectURL(f));
    setDeleteImage(false);
    setImageDirty(true);
  }

  function onDeleteImage() {
    setPreview(null);
    setImageFile(null);
    setDeleteImage(true);
    setImageDirty(true);
  }

  async function onSubmit(data) {
    try {
      let image_id = event.image_id ?? null;

      if (imageFile) {
        if (event.image?.id) await deleteSiteImageAPI(event.image.id, event.image.image_path);
        const img = await uploadEventImageAPI(imageFile);
        image_id = img.id;
      } else if (deleteImage && event.image?.id) {
        await deleteSiteImageAPI(event.image.id, event.image.image_path);
        image_id = null;
      }

      const updated = await updateEventAPI(event.id, {
        ...data,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        start_time: data.start_time || null,
        end_time: data.end_time || null,
        image_id,
      });

      dispatch(updateEvent(updated));
      toast.success('Event updated');
      navigate('/admin/event_overview');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save event');
    }
  }

  const canSave = (isDirty || imageDirty) && !isSubmitting;

  return (
    <PageContainer bg="admin">
      <div className="sticky top-0 bg-hmc-bodybackground z-10">
        <AdminPageHeader
          title="Edit Event"
          action={
            <div className="flex items-center gap-4">
              <Controller
                name="active"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-hmc-textprimary px-4 py-2">
                    <input
                      type="checkbox"
                      checked={Boolean(field.value)}
                      onChange={e => field.onChange(e.target.checked)}
                      className="h-4 w-4 cursor-pointer accent-hmc-textprimary"
                    />
                    Active
                  </label>
                )}
              />
              <button
                type="button"
                onClick={() => navigate('/admin/event_overview')}
                className="px-4 py-2 text-sm border border-hmc-border-a text-hmc-textprimary hover:bg-hmc-button-a/20"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-event-form"
                disabled={!canSave}
                className="px-4 py-2 text-sm bg-hmc-button-a text-hmc-button-text-a font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving…' : 'Save'}
              </button>
            </div>
          }
        />
      </div>

      <form id="edit-event-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
        {/* Left: Title + Description */}
        <div className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Title</label>
            <input className={`${inputClass} ${errors.title ? 'border-red-400' : ''}`} {...register('title', { required: 'Title is required' })} />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>
          <div className="flex-1">
            <label className={labelClass}>Description</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={10}
              placeholder="Enter event description…"
              {...register('description')}
            />
          </div>
        </div>

        {/* Right: Dates, Times, URL, Image */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-3">
            <div className="w-fit">
              <label className={labelClass}>Start Date</label>
              <input type="date" className={inputClass} {...register('start_date')} />
            </div>
            <div className="w-fit">
              <label className={labelClass}>End Date</label>
              <input type="date" className={inputClass} {...register('end_date')} />
            </div>
            <div className="w-fit">
              <label className={labelClass}>Start Time</label>
              <input type="time" className={inputClass} {...register('start_time')} />
            </div>
            <div className="w-fit">
              <label className={labelClass}>End Time</label>
              <input type="time" className={inputClass} {...register('end_time')} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Link URL</label>
            <input className={inputClass} placeholder="https://" {...register('url')} />
          </div>
          <div>
            <label className={labelClass}>Image</label>
            {preview && (
              <img src={preview} alt="preview" className="mb-2 w-full object-contain border border-hmc-border-b max-h-48" />
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="text-xs border border-hmc-border-b px-3 py-1.5 text-hmc-textprimary hover:border-hmc-border-a"
              >
                {preview ? 'Replace' : 'Upload image'}
              </button>
              {preview && (
                <button
                  type="button"
                  onClick={onDeleteImage}
                  className="text-xs border border-red-300 px-3 py-1.5 text-red-500 hover:border-red-500"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </PageContainer>
  );
}
