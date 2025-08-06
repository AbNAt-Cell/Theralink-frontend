import { Event } from "@/types/calendar.d";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EventListProps {
  events: Event[];
  error: any;
  loading: Boolean;
}

export function EventList({ events, error, loading }: EventListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
      </div>
      <ScrollArea className="flex-1 px-6">
        <div className="space-y-6 py-4">
          <h3 className="text-sm font-medium text-muted-foreground">You are going to</h3>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading appointments...</p>
          ) : error ? (
            <p className="text-red-600 text-sm">{error}</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="flex items-start space-x-4">
                <Avatar className="mt-1">
                  <div className={`w-full h-full bg-[#ff9e58]`} />
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium leading-none">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </p>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
