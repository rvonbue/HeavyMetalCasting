import { useSelector } from 'react-redux';
import { PageContainer } from '../../components/Resuables';

function EventCard({ event }) {
  return (
    <div className="flex flex-col gap-4">
      {event.image && (
        <a href={event.url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden">
          <img
            src={event.image.image_url}
            alt={event.image.alt_text || event.title}
            className="w-full object-cover hover:opacity-90 transition-opacity"
          />
        </a>
      )}
      <div className="text-left">
        <h2 className="text-lg font-bold text-hmc-c">{event.title}</h2>
        {event.description && (
          <div className="mt-2 text-sm text-hmc-text-a leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: event.description }} />
        )}
        {event.url && (
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-xs text-hmc-c underline underline-offset-2 hover:text-hmc-b transition-colors"
          >
            Learn more →
          </a>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  const events = useSelector(state => state.events.events);

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold text-hmc-c text-left mt-6 mb-8">Events</h1>

      {events.length === 0 ? (
        <p className="text-hmc-text-a text-sm">No upcoming events.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
